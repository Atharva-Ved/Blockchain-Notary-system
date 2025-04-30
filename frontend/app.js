const contractABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "notarizeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Replace with your deployed contract address after deployment
let contractAddress = "0x05A09b8E3301bF02E6D9789DC054738779572Bb9";

let web3;
let contract;
let accounts;

window.addEventListener('load', async () => {
  // Connect to Ganache provider directly (no Metamask)
  if (window.ethereum) {
    // If Metamask is present, do not use it as per user request
    alert("Please disable Metamask or use a browser without Metamask for this app.");
    return;
  }

  // Connect to Ganache local blockchain
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    alert("No accounts found in Ganache. Please make sure Ganache is running.");
    return;
  }

  // Removed prompt for contract address to use hardcoded address
  // contractAddress = prompt("Enter deployed Notary contract address:");

  contract = new web3.eth.Contract(contractABI, contractAddress);

  document.getElementById('notarizeBtn').addEventListener('click', notarizeDocument);
  document.getElementById('verifyBtn').addEventListener('click', verifyDocument);
});

function arrayBufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

async function hashFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return arrayBufferToHex(hashBuffer);
}

async function notarizeDocument() {
  const fileInput = document.getElementById('documentToNotarize');
  const resultDiv = document.getElementById('notarizeResult');
  resultDiv.textContent = "";

  if (fileInput.files.length === 0) {
    resultDiv.textContent = "Please select a file to notarize.";
    return;
  }

  const file = fileInput.files[0];
  const fileHash = await hashFile(file);
  resultDiv.textContent = "File hash: " + fileHash + "\nSending transaction to notarize...";

  try {
    await contract.methods.notarizeDocument("0x" + fileHash).send({ from: accounts[0], gas: 300000 });
    resultDiv.textContent = "Notarization successful!\nFile hash: " + fileHash;
  } catch (error) {
    if (error.message.includes("Document already notarized")) {
      resultDiv.textContent = "This document is already notarized.\nFile hash: " + fileHash;
    } else {
      resultDiv.textContent = "Error during notarization: " + error.message;
    }
  }
}

async function verifyDocument() {
  const fileInput = document.getElementById('documentToVerify');
  const resultDiv = document.getElementById('verifyResult');
  resultDiv.textContent = "";

  if (fileInput.files.length === 0) {
    resultDiv.textContent = "Please select a file to verify.";
    return;
  }

  const file = fileInput.files[0];
  const fileHash = await hashFile(file);
  resultDiv.textContent = "File hash: " + fileHash + "\nChecking notarization status...";

  try {
    const response = await contract.methods.verifyDocument("0x" + fileHash).call();
    const isNotarized = response[0];
    const timestamp = response[1];

    if (isNotarized) {
      const date = new Date(timestamp * 1000);
      resultDiv.textContent = "Document is notarized.\nFile hash: " + fileHash + "\nTimestamp: " + date.toLocaleString() + "\nVerified successfully!";
    } else {
      resultDiv.textContent = "Document is NOT notarized.\nFile hash: " + fileHash;
    }
  } catch (error) {
    resultDiv.textContent = "Error during verification: " + error.message;
  }
}
