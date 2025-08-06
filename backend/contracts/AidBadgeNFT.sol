// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Counters.sol";

contract AidBadgeNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("AidChainBadge", "AIDNFT") {}

// Function to mint a badge NFT for a recipient/ donor(Admin akan approve dulu), receive wallet address and metadata URI
    function mintBadge(address recipient, string memory uri) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newId = _tokenIds;

        _mint(recipient, newId);
        _setTokenURI(newId, uri);

        return newId;
    }
}
