Siti Fatimah, [10/08/2025 12:39 AM]
# AidChain

AidChain — a decentralized aid distribution platform that combines public transparency with optional donor confidentiality.  
Donors choose whether their donation is public (Sepolia) or confidential (Oasis Sapphire). Recipients and admins operate on Sepolia only.

---

## ✅ Quick Links

- Live Demo: [https://your-demo-link.example](https://your-demo-link.example)
- Video Demo (≤ 3 min): [https://your-video-link.example](https://your-video-link.example)
- GitHub Repo: [https://github.com/your-username/aidchain](https://github.com/your-username/aidchain)

---

## 🔎 Overview

AidChain enables donors to send funds directly to approved recipients and allows admins to manage aid requests in a transparent way.  
Donors can opt to make a confidential donation via Oasis Sapphire — keeping sensitive donor information (amount and/or identity) protected inside a TEE — while recipients and admins use Sepolia for open governance and claims.

This hybrid design gives humanitarian projects flexibility: public traceability where needed, privacy where required.

---

## ✨ Key Features

- Role-based UX: Donor, Recipient, Admin.
- Donor network choice: Sepolia (public) or Oasis Sapphire (confidential).
- On-chain aid requests and admin approvals (Sepolia).
- ConfidentialDonations contract on Sapphire for donor-private records.
- NFT badges for donors & recipients.
- Express backend for an AI/chatbot assistant (optional, separate from blockchain).
- Simple React UI (connect wallet → choose role → interact).

---

## 🧰 Tech Stack

- Frontend: React, Vite, TypeScript  
- Wallet/Web3: Wagmi, viem, MetaMask  
- Smart Contracts: Solidity, Hardhat  
- Networks: Ethereum Sepolia, Oasis Sapphire Testnet  
- Backend (optional): Express.js (chatbot API)  
- NFT Storage: Pinata / IPFS (optional)

---

## 📁 Repository Structure

---

## ⚙️ Setup & Local Development

### Prerequisites
- Node.js ≥ 18
- npm or Yarn
- MetaMask browser extension
- (Optional) Pinata account for NFT metadata

---

### 1. Clone the Repo

---

```bash
git clone https://github.com/your-username/aidchain.git
cd aidchain

### 2. Install Dependencies

---

# Frontend
cd frontend
npm install

# Backend 
cd ../backend
npm install

# confidential-donations
cd ../confidential-donations
npm install

### 3. Environment Variables

Create .env files in each directory as follows:

---

#### Frontend (`/frontend/.env`)
```env
# Contract addresses (replace with deployed ones)
VITE_BADGE_CONTRACT=0xYourSepoliaBadgeContractAddress
VITE_AID_CONTRACT=0xYourSepoliaAidChainContractAddress
VITE_CONFIDENTIAL_DONATION_CONTRACT=0xYourSapphireConfidentialContractAddress

#### Backend (/backend/.env)
# Gemini API Key for chatbot integration
GEMINI_API_KEY=your_gemini_api_key_here
# Express server port
PORT=5000


#### Confidential Donations (/confidential-donations/.env)
# Your deployer wallet private key (DO NOT COMMIT)
PRIVATE_KEY=your_deployer_private_key_here
# Contract address on Sapphire for confidential donations
VITE_CONFIDENTIAL_DONATION_CONTRACT=0xYourSapphireConfidentialContractAddress

### 4. Compile & Deploy Contracts
#Compile 
- npx hardhat compile

#Deploy to Sepolia
- npx hardhat run scripts/deploy-sepolia.js --network sepolia

#Deploy to Sapphire Testnet
- npx hardhat run scripts/deploy-sapphire.js --network sapphireTestnet

### 5. Contract Addresses
| Contract              | Network  | Address                                     |
| --------------------- | -------- | ------------------------------------------- |
| AidChain              | Sepolia  | 0xYourSepoliaAidChainAddress              |
| AidBadgeNFT           | Sepolia  | 0xYourSepoliaNFTAddress                   |
| ConfidentialDonations | Sapphire | 0xYourSapphireConfidentialContractAddress |

### 6.  Testing Instructions

# Faucets
- Sepolia ETH Faucet: Search “Sepolia faucet” or use Alchemy/Infura faucet.

- Sapphire Testnet: Add network manually in MetaMask:
    - RPC: https://testnet.sapphire.oasis.dev
    - Chain ID: 0x5aff
    - Currency: TEST
    - Faucet: https://faucet.oasis.dev

Siti Fatimah, [10/08/2025 12:39 AM]
### 7.  Test Cases
A. Connect Wallet
Open the frontend.

Click Connect Wallet and connect MetaMask.

B. Donate via Sepolia
Choose Sepolia as the network.

Enter recipient and amount.

Confirm in MetaMask.

Check TX in Sepolia Explorer.

C. Donate via Sapphire
Switch to Sapphire Testnet.

Enter recipient and amount.

Confirm in MetaMask.

Verify that details are private on-chain.

D. Mint NFT Badge
After donating or being approved, click Mint Badge.

Confirm TX in MetaMask.

E. Admin Approves Recipient
Log in as Admin.

Approve aid requests.

F. Recipient Claims Aid
Log in as Recipient.

Click Claim Aid and confirm.

🔍 Verifying Confidentiality (Sapphire)
Public explorers show TX, but not donor details or amounts.

Only the donor can retrieve their donation history via getMyDonations().

🎯 SDG Alignment
SDG 16 – Peace, Justice and Strong Institutions: Transparent aid distribution.

SDG 17 – Partnerships for the Goals: Collaboration between donors, NGOs, and developers.

SDG 1 – No Poverty: Direct support to people in need.

SDG 10 – Reduced Inequalities: Equal access to financial aid.

📄 License
This project is released under the MIT License.

🙋 Contact & Contribution
Authors: 
 - Siti Fatimah : 223846@student.upm.edu.my
 - Nur A'in Safieya : 225561@student.upm.edu.my
 - Qurratun Aina Sakinah : 222698@student.upm.edu.my
 - Nuraina Elayani : 223230@student.upm.edu.my

Contributions welcome via PRs or Issues.