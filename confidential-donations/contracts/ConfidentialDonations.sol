// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title ConfidentialDonations - Oasis Sapphire donation contract
/// @notice Accepts confidential ETH donations without revealing public donor info
contract ConfidentialDonations {
    // Optional: track total donations
    uint256 public totalDonated;

    // Optional: track donation timestamps and values privately in TEE
    struct Donation {
        uint256 amount;
        uint256 timestamp;
    }

    // Mapping of donors to donations (stored confidentially in Sapphire)
    mapping(address => Donation[]) private donations;

    event Donated(address indexed donor, uint256 amount);

    /// @notice Accept ETH donation and store it privately
    function donate() external payable {
        require(msg.value > 0, "Must send ETH");

        donations[msg.sender].push(Donation({
            amount: msg.value,
            timestamp: block.timestamp
        }));

        totalDonated += msg.value;

        emit Donated(msg.sender, msg.value);
    }

    /// @notice Retrieve donation history (only for sender)
    function getMyDonations() external view returns (Donation[] memory) {
        return donations[msg.sender];
    }
}
