// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Counters.sol";
import "./AidBadgeNFT.sol"; // Importing AidBadgeNFT for minting badges

contract AidChain is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _donorTokenIds;
    Counters.Counter private _recipientTokenIds;

    uint256 public currentCycleId;
    uint256 public currentCycleStart;
    uint256 public donationCycleDuration = 14 days;
    address public activeRecipient;
    bool public cycleClaimed;

    AidBadgeNFT public badgeNFT;

    constructor(address badgeContractAddress) ERC721("AidChain", "AID") {
        badgeNFT = AidBadgeNFT(badgeContractAddress);
    }

    struct AidRequest {
        address recipient;
        string reason;
        uint256 timestamp;
        bool approved;
        bool claimed;
        string location;
        string name;
        string contact;
    }

    struct Donation {
        address donor;
        address recipient;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => bool) public approvedRecipients;
    mapping(address => bool) public hasClaimedAid;
    mapping(address => bool) public hasDonated;
    mapping(address => AidRequest) public aidRequests;
    mapping(address => bool) public flaggedAddresses;

    mapping(uint256 => mapping(address => bool)) public hasClaimedAidByCycle;
    mapping(uint256 => mapping(address => bool)) public hasAppliedByCycle;
    mapping(address => uint256) public lastClaimedAt;

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
    event RejectedByNFA(address indexed recipient, string reason);

    function donate(address recipient) external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(approvedRecipients[recipient], "Recipient not approved");

        donations.push(Donation({
            donor: msg.sender,
            recipient: recipient,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        totalDonated += msg.value;
        hasDonated[msg.sender] = true;

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    function applyForAid(string memory reason, string memory location, string memory name, string memory contact) external {
        require(bytes(reason).length > 0, "Reason cannot be empty");
        require(block.timestamp >= lastClaimedAt[msg.sender] + 90 days, "Wait 3 months before reapplying");
        require(!hasAppliedByCycle[currentCycleId][msg.sender], "Already applied");

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

        aidRequestsList.push(msg.sender);

        hasAppliedByCycle[currentCycleId][msg.sender] = true;
        bool isEligible = !flaggedAddresses[msg.sender] && bytes(reason).length > 20;

        if (isEligible) {
            approvedRecipients[msg.sender] = true;
            aidRequests[msg.sender].approved = true;
            activeRecipient = msg.sender;
            currentCycleStart = block.timestamp;
            emit ApprovedByNFA(msg.sender, block.timestamp);
        } else {
            emit RejectedByNFA(msg.sender, "NFA rejected: Ineligible or poor reason");
        }

        emit AidRequested(msg.sender, reason, block.timestamp);
    }

    function approveRecipient(address recipient) external onlyOwner {
        require(aidRequests[recipient].recipient != address(0), "No aid request found");

        approvedRecipients[recipient] = true;
        aidRequests[recipient].approved = true;

        emit RecipientApproved(recipient, block.timestamp);
    }

    function claimAid() external {
        require(approvedRecipients[msg.sender], "Not approved for aid");
        require(!hasClaimedAidByCycle[currentCycleId][msg.sender], "Already claimed");
        require(block.timestamp >= currentCycleStart + donationCycleDuration, "Wait until 14 days passed");

        cycleClaimed = true;
        lastClaimedAt[msg.sender] = block.timestamp;
        hasClaimedAidByCycle[currentCycleId][msg.sender] = true;
        aidRequests[msg.sender].claimed = true;

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
        require(cycleClaimed || block.timestamp >= currentCycleStart + donationCycleDuration + 5 days, "Too early to reset");
        activeRecipient = address(0);
        cycleClaimed = false;
        currentCycleStart = 0;
        currentCycleId += 1;
    }

    function mintDonorNFT(address donor) external onlyOwner {
        require(hasDonated[donor], "Address has not donated");
        string memory donorURI = "https://ipfs.io/ipfs/QmDonorNFTMetadata";
        badgeNFT.mintBadge(donor, donorURI);
        emit DonorNFTMinted(donor, block.timestamp);
    }

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
            return "https://ipfs.io/ipfs/QmDonorNFTMetadata";
        } else {
            return "https://ipfs.io/ipfs/QmRecipientNFTMetadata";
        }
    }
}
