// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Counters.sol";
import "./AidBadgeNFT.sol"; // Importing AidBadgeNFT for minting badges

contract AidChain is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _donorTokenIds;
    Counters.Counter private _recipientTokenIds;
    
    uint256 public currentCycleId; //utk create cycle
    uint256 public currentCycleStart;     
    // real: uint256 public donationCycleDuration = 14 days; 
    uint256 public donationCycleDuration = 15 seconds;  //ni testing
    address public activeRecipient;
    bool public cycleClaimed;

    AidBadgeNFT public badgeNFT; // Instance of AidBadgeNFT contract

    constructor(address badgeContractAddress) ERC721("AidChain", "AID") {
    badgeNFT = AidBadgeNFT(badgeContractAddress);  // Initialize the AidBadgeNFT contract
        admins[msg.sender] = true; // Owner is also default admin

    }

    
    struct AidRequest {
        address recipient;
        string reason;
        uint256 timestamp;
        bool approved;
        bool claimed;
        string location;    //untuk tambah location applicant
        string name;
        string contact;
    }
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => bool) public approvedRecipients;
    mapping(address => bool) public hasClaimedAid;  //ni mcm boleh buang sbb ada mapping hasClaimedAidByCycle?
    mapping(address => bool) public hasDonated;
    mapping(address => AidRequest) public aidRequests;
    mapping(address => bool) public flaggedAddresses;

    mapping(uint256 => mapping(address => bool)) public hasClaimedAidByCycle; //user dah claim blum utk cycle tu
    mapping(uint256 => mapping(address => bool)) public hasAppliedByCycle; //user dah apply blum utk each cycle
    mapping(address => uint256) public lastClaimedAt; //timestamp last time user claim

    mapping(address => bool) public admins; //allow multiple admins

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    
    Donation[] public donations;
    address[] public aidRequestsList;
    
    uint256 public totalDonated;
    
    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
    event AidRequested(address indexed recipient, string reason, uint256 timestamp);
    event RecipientApproved(address indexed recipient, uint256 timestamp);
    event AidClaimed(address indexed recipient, uint256 amount, uint256 timestamp);
    event DonorNFTMinted(address indexed donor, uint256 tokenId);
    event RecipientNFTMinted(address indexed recipient, uint256 tokenId);
    event ApprovedByNFA(address indexed recipient, uint256 timestamp);
    event RejectedByNFA(address indexed recipient, string reason); // newly added by ain

    
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        totalDonated += msg.value;
        hasDonated[msg.sender] = true;
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }
    
    // FUNCTION - for users to apply for aid
    function applyForAid(
        string memory reason,
        string memory location,
        string memory name,
        string memory contact
    ) external {
        require(bytes(reason).length > 0, "Reason cannot be empty");
        
        // real: require(block.timestamp >= lastClaimedAt[msg.sender] + 90 days, "Wait 3 months before reapplying"); 
        // user boleh apply balik after 3 bulan
        
        // demo purpose (guna 30 saat instead of 90 hari)
        require(block.timestamp >= lastClaimedAt[msg.sender] + 5 seconds, "Please wait before reapplying (demo mode)");

        require(!hasAppliedByCycle[currentCycleId][msg.sender], "Already applied"); // user dah apply utk current cycle

        emit AidRequested(msg.sender, "DEBUG: passed validation", block.timestamp);

        // First step - simpan detail permohonan user
        aidRequests[msg.sender] = AidRequest({
            recipient: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            approved: false,
            claimed: false,
            location: location,
            name: name,
            contact: contact
        });
        
        // Second step - masukkan wallet address dalam list permohonan
        aidRequestsList.push(msg.sender);

        // Third step - NFA logic
        // Mark user already applied for this cycle
        hasAppliedByCycle[currentCycleId][msg.sender] = true;

        // Define if user is first-time applicant
        bool isFirstTime = !approvedRecipients[msg.sender]; // Belum pernah lulus = first time

        // Check if user is eligible for auto-approval (NFA)
        // Hanya yang dah pernah diluluskan secara manual boleh auto-lulus
        bool isEligible = approvedRecipients[msg.sender] && !flaggedAddresses[msg.sender];

        // === Logic below: ===
        // - Kalau first time → tunggu admin lulus
        // - Kalau bukan first time & layak → auto-lulus oleh NFA
        if (isFirstTime) {
            // First time: tunggu manual approval
            emit AidRequested(msg.sender, reason, block.timestamp);
        } else if (isEligible) {
            // User verified + not flagged → auto-approved by NFA
            aidRequests[msg.sender].approved = true;
            activeRecipient = msg.sender;
            currentCycleStart = block.timestamp;
            emit ApprovedByNFA(msg.sender, block.timestamp);
        } else {
            // Rejected by NFA (walaupun dah verified, tapi kena flagged)
            emit RejectedByNFA(msg.sender, "NFA rejected: Ineligible or flagged");
        }

        // Fourth step - tetap log permohonan untuk rekod blockchain
        emit AidRequested(msg.sender, reason, block.timestamp);
    }

    
    function approveRecipient(address recipient) external onlyAdmin  {
        require(aidRequests[recipient].recipient != address(0), "No aid request found");
        
        approvedRecipients[recipient] = true;
        aidRequests[recipient].approved = true;
        
        emit RecipientApproved(recipient, block.timestamp);
    }
    
    function claimAid() external {  //recipient can claim after 14days 
        require(approvedRecipients[msg.sender], "Not approved for aid");
        require(!hasClaimedAidByCycle[currentCycleId][msg.sender], "Already claimed");
        require(block.timestamp >= currentCycleStart + donationCycleDuration, "Wait until 14 days passed");

        cycleClaimed = true;
        lastClaimedAt[msg.sender] = block.timestamp;
        hasClaimedAidByCycle[currentCycleId][msg.sender] = true;
        aidRequests[msg.sender].claimed = true;
        hasClaimedAid[msg.sender] = true;
        
        uint256 payout = address(this).balance;
        require(payout > 0, "No funds to claim");
        payable(msg.sender).transfer(payout);
        
        emit AidClaimed(msg.sender, payout, block.timestamp);
    }
    
    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }
    
    function getAidRequests() external view returns (address[] memory) {
        return aidRequestsList;
    }

    function resetCycle() external onlyOwner {
        require(cycleClaimed || block.timestamp >= currentCycleStart + donationCycleDuration + 5 days,"Too early to reset"); //akan reset cycle aftr claim or dah >5 days utk claim 

        activeRecipient = address(0);  //all this perlu utk set new cycle for user
        cycleClaimed = false;
        currentCycleStart = 0;
        currentCycleId += 1;
    }

    
        //For minting Donor NFT
        function mintDonorNFT(address donor) external {
        require(hasDonated[donor], "Address has not donated");

        string memory donorURI = "https://ipfs.io/ipfs/bafkreicoxgs3k2x2p6ck6ve4a6cu6mhypva7th662mqb34afbn4zqeywye";
        badgeNFT.mintBadge(donor, donorURI);

        emit DonorNFTMinted(donor, block.timestamp);
    }

        
        //For minting Recipient NFT
    function mintRecipientNFT(address recipient) external {
        require(hasClaimedAid[recipient], "Address has not claimed aid");

        string memory recipientURI = "https://ipfs.io/ipfs/bafkreiev75owvthyhz376aumgdnufqieh23agh2bnvvmybccmqlcibhfey";
        badgeNFT.mintBadge(recipient, recipientURI);

        emit RecipientNFTMinted(recipient, block.timestamp);
    }

    function addAdmin(address newAdmin) external onlyOwner {
        admins[newAdmin] = true;
    }

    function removeAdmin(address adminToRemove) external onlyOwner {
        admins[adminToRemove] = false;
    }

    
    function flagAddress(address addr) external onlyOwner {
        flaggedAddresses[addr] = true;
    }
    
    function unflagAddress(address addr) external onlyOwner {
        flaggedAddresses[addr] = false;
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        if (tokenId <= 10000) {
            // Donor NFT
            return "https://ipfs.io/ipfs/bafkreicoxgs3k2x2p6ck6ve4a6cu6mhypva7th662mqb34afbn4zqeywye";
        } else {
            // Recipient NFT
            return "https://ipfs.io/ipfs/bafkreiev75owvthyhz376aumgdnufqieh23agh2bnvvmybccmqlcibhfey";
        }
    }

    //functions to allow owner to add/remove admins
    
}
