// contracts/Message.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Message {
    string private message;
    address public owner;
    
    event MessageChanged(string newMessage);
    
    constructor() {
        owner = msg.sender;
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageChanged(newMessage);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}