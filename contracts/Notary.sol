// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Notary {
    mapping(bytes32 => uint256) private notarizedDocuments;

    event DocumentNotarized(bytes32 indexed documentHash, uint256 timestamp);

    function notarizeDocument(bytes32 documentHash) public {
        require(notarizedDocuments[documentHash] == 0, "Document already notarized");
        notarizedDocuments[documentHash] = block.timestamp;
        emit DocumentNotarized(documentHash, block.timestamp);
    }

    function verifyDocument(bytes32 documentHash) public view returns (bool, uint256) {
        uint256 timestamp = notarizedDocuments[documentHash];
        if (timestamp == 0) {
            return (false, 0);
        }
        return (true, timestamp);
    }
}
