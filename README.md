# Notary Smart Contract Project

## Description
This project implements a simple Notary smart contract on the Ethereum blockchain using Solidity. The contract allows users to notarize documents by storing their hash along with a timestamp, and verify if a document has been notarized and when.

The project uses Hardhat as the development environment and includes a deployment script to deploy the contract to a local Ganache blockchain.

## Prerequisites
- [Node.js](https://nodejs.org/) (v12 or higher)
- [npm](https://www.npmjs.com/)
- [Ganache](https://trufflesuite.com/ganache/) (for local Ethereum blockchain)

## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies:
   ```bash
   npm install
   ```

## Compile and Deploy
1. Start Ganache to run a local blockchain on `http://127.0.0.1:7545`.
2. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```
3. Deploy the Notary contract:
   ```bash
   npx hardhat run scripts/deploy.js --network ganache
   ```
4. The deployment script will output the deployed contract address.

## Running Ganache
Ganache provides a local Ethereum blockchain for development and testing. Download and install Ganache from the [official site](https://trufflesuite.com/ganache/), then start it to listen on the default RPC server at `http://127.0.0.1:7545`.

## Contract Functions
- `notarizeDocument(bytes32 documentHash)`: Notarizes a document by storing its hash and the current timestamp. Throws an error if the document is already notarized.
- `verifyDocument(bytes32 documentHash)`: Returns a tuple `(bool, uint256)` indicating whether the document hash is notarized and the timestamp of notarization.

## Project Structure
```
.
├── contracts/
│   └── Notary.sol          # Solidity smart contract
├── scripts/
│   └── deploy.js           # Deployment script
├── frontend/               # Frontend files (HTML, JS, images)
├── artifacts/              # Compiled contract artifacts (auto-generated)
├── cache/                  # Hardhat cache (auto-generated)
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Dependencies
- Hardhat: Ethereum development environment
- Ethers.js: Ethereum JavaScript library for interacting with contracts
- Waffle & Chai: Testing libraries for smart contracts

## Notes
- This project is configured to deploy to a local Ganache blockchain.
- Modify `hardhat.config.js` to add other networks if needed.
