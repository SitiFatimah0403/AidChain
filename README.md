# AidChain

AidChain — a decentralized aid distribution platform that combines public transparency with optional donor confidentiality.  
Donors choose whether their donation is public (Sepolia) or confidential (Oasis Sapphire). Recipients and admins operate on Sepolia only.

---

## ✅ Quick Links

- Video Demo (≤ 3 min): [https://youtu.be/syObmIAcRZY]
- Presentation Video : [https://your-video-link.example]
- GitHub Repo: [https://github.com/SitiFatimah0403/AidChain.git]

---

## 🔎 Overview

AidChain lets donors send funds directly to verified recipients while giving admins the tools to review, approve, and manage aid requests transparently. Donors can choose to make confidential contributions through Oasis Sapphire, which keeps sensitive details like donor identity and/or donation amount protected inside a Trusted Execution Environment (TEE). Meanwhile, Sepolia is used for transparent governance, approvals, and claims.
This hybrid approach combines public traceability where it builds trust and privacy where it safeguards sensitive information — making it ideal for humanitarian projects.

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

The AidChain project is structured into several key directories and files to separate concerns and organize the codebase effectively. The backend/ directory contains the server-side logic, including the API routes (like chatbotRoute.js), the Solidity smart contracts (AidChain.sol and AidBadgeNFT.sol), and backend services such as the aid chatbot (aidChatBot.js). It also holds its own Node.js dependencies, environment variables (.env), and server entry point (server.js).

The confidential-donations/ folder is a distinct module focused on confidential donation functionality. It contains its own smart contracts, scripts, tests, and configuration files (like hardhat.config.js) along with separate Node.js dependencies and environment settings. This separation allows it to be developed and deployed independently from the main AidChain backend.

The frontend/ folder houses the React-based user interface and is subdivided into multiple layers. Inside src/, there are folders for admin-related logic (admin/), reusable UI components (components/), contract ABIs (contracts/), custom React hooks for blockchain interactions (hooks/), and different page components (pages/). The types/ folder contains TypeScript type definitions used throughout the frontend. The frontend also includes important configuration files and assets such as the environment variables file (.env), build and linting configs (vite.config.ts, eslint.config.js), styling (index.css and Tailwind config), and the main entry points (main.tsx, App.tsx). This setup supports modular, scalable front-end development integrated tightly with blockchain contracts and wallet interactions.

At the root level of the project, there are general configuration and dependency management files, including .gitignore to exclude files from version control, and package.json / package-lock.json files for managing npm packages across the entire project or monorepo structure.


---

## ⚙️ Setup & Local Development

### Prerequisites
- Node.js ≥ 18
- npm or Yarn
- MetaMask browser extension
- (Optional) Pinata account for NFT metadata

---

### Step by Step Guidelines 

---

```bash

### 1. Clone the Repo

---

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
    - Chain ID : 23295
    - Currency: TEST
    - Faucet: https://faucet.oasis.dev


### 7.  Test Cases
A. Connect Wallet
- Open the frontend.
- Click Connect Wallet and connect MetaMask.

B. Donate via Sepolia
- Choose Sepolia as the network.
- Enter recipient and amount.
- Confirm in MetaMask.
- Check TX in Sepolia Explorer.

C. Donate via Sapphire
- Switch to Sapphire Testnet.
- Enter recipient and amount.
- Confirm in MetaMask.
- Verify that details are private on-chain.

D. Mint NFT Badge
- After donating or being approved, click Mint Badge.
- Confirm TX in MetaMask.

E. Admin Approves Recipient
- Log in as Admin.
- Approve aid requests.

F. Recipient Claims Aid
- Log in as Recipient.
- Click Claim Aid and confirm.

🔍 Verifying Confidentiality (Sapphire)
- Public explorers show TX, but not donor details or amounts.
- Only the donor can retrieve their donation history via getMyDonations().

🎯 SDG Alignment
- SDG 16 – Peace, Justice and Strong Institutions: Transparent aid distribution.
- SDG 17 – Partnerships for the Goals: Collaboration between donors, NGOs, and developers.
- SDG 1 – No Poverty: Direct support to people in need.
- SDG 10 – Reduced Inequalities: Equal access to financial aid.

📄 License
This project is released under the MIT License.

🙋 Contact & Contribution
Authors: 
 - Siti Fatimah : 223846@student.upm.edu.my
 - Nur A'in Safieya : 225561@student.upm.edu.my
 - Qurratun Aina Sakinah : 222698@student.upm.edu.my
 - Nuraina Elayani : 223230@student.upm.edu.my

Contributions welcome via PRs or Issues.
