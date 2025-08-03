// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AidBadgeNFT.sol"; // Importing AidBadgeNFT for minting badges


contract AidChain is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _donorTokenIds;
    Counters.Counter private _recipientTokenIds;
    
    uint256 public currentCycleStart;     //utk create duration
    uint256 public donationCycleDuration = 14 days;
    address public activeRecipient;
    bool public cycleClaimed;

    AidBadgeNFT public badgeNFT; // Instance of AidBadgeNFT contract

    constructor(address badgeContractAddress) ERC721("AidChain", "AID") {
    badgeNFT = AidBadgeNFT(badgeContractAddress);  // Initialize the AidBadgeNFT contract
    }

    
    struct AidRequest {
        address recipient;
        string reason;
        uint256 timestamp;
        bool approved;
        bool claimed;
        string location;    //untuk tambah location applicant
    }
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => bool) public approvedRecipients;
    mapping(address => bool) public hasClaimedAid;
    mapping(address => bool) public hasDonated;
    mapping(address => AidRequest) public aidRequests;
    mapping(address => bool) public flaggedAddresses;
    
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
    
    //FUNCTION - for users to applyForAid
    function applyForAid(string memory reason) external {
        require(bytes(reason).length > 0, "Reason cannot be empty");
        require(aidRequests[msg.sender].recipient == address(0), "Already applied");    //nak elak same user apply multiple times
        
        // First step - simpan dulu detail of user's aid request
        aidRequests[msg.sender] = AidRequest({
            recipient: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            approved: false,
            claimed: false,
            location: location
        });
        
        // Second step - simpan user's wallet address dan info tadi (in order)
        aidRequestsList.push(msg.sender);

        // Third step - ni as NFA (which will check if dia pernah appy aids, dia akan auto approve - kalau dia approve, kita boleh tengok apa reason dia approve)
        // isEligible will check if 1) user has not already claimed, 2) suer is not flagged, 3) reason tak lebih 20 chars (double check)
        bool isEligible = !hasClaimedAid[msg.sender] &&
                        !flaggedAddresses[msg.sender] &&
                        bytes(reason).length > 20; // Make sure reason is at least 20 chars

        if (isEligible) {
            approvedRecipients[msg.sender] = true;
            aidRequests[msg.sender].approved = true;
            emit ApprovedByNFA(msg.sender, block.timestamp);
        } else {
            emit RejectedByNFA(msg.sender, "NFA rejected: Ineligible or poor reason");
        }

        // Fourth step - takkesahla approve or rejected, still kena log the result after user submit request (ni penting dalam blockchain)
        emit AidRequested(msg.sender, reason, block.timestamp);
    }
    
    function approveRecipient(address recipient) external onlyOwner {
        require(aidRequests[recipient].recipient != address(0), "No aid request found");
        
        approvedRecipients[recipient] = true;
        aidRequests[recipient].approved = true;
        
        emit RecipientApproved(recipient, block.timestamp);
    }
    
    function claimAid() external {  //recipient can claim after 14days 
        require(approvedRecipients[msg.sender], "Not approved for aid");
        require(!hasClaimedAid[msg.sender], "Already claimed aid");
        require(block.timestamp >= currentCycleStart + donationCycleDuration, "Wait until cycle ends");

        cycleClaimed = true;
        hasClaimedAid[msg.sender] = true;
        aidRequests[msg.sender].claimed = true;
        
        uint256 payout = address(this).balance;
        payable(msg.sender).transfer(payout);
        
        emit AidClaimed(msg.sender, payout, block.timestamp);
    }
    
    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }
    
    function getAidRequests() external view returns (address[] memory) {
        return aidRequestsList;
    }
    
    //For minting Donor NFT
    function mintDonorNFT(address donor) external onlyOwner {
    require(hasDonated[donor], "Address has not donated");

    string memory donorURI = "https://ipfs.io/ipfs/QmDonorNFTMetadata";
    badgeNFT.mintBadge(donor, donorURI);

    emit DonorNFTMinted(donor, block.timestamp);
}

    
    //For minting Recipient NFT
  function mintRecipientNFT(address recipient) external onlyOwner {
    require(hasClaimedAid[recipient], "Address has not claimed aid");

    string memory recipientURI = "https://ipfs.io/ipfs/QmRecipientNFTMetadata";
    badgeNFT.mintBadge(recipient, recipientURI);

    emit RecipientNFTMinted(recipient, block.timestamp);
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
            return "https://ipfs.io/ipfs/QmDonorNFTMetadata";
        } else {
            // Recipient NFT
            return "https://ipfs.io/ipfs/QmRecipientNFTMetadata";
        }
    }
}
