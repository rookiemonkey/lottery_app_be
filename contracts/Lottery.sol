// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
 
contract Lottery {
  address public manager;
  address[] public players;
  
  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    require(msg.value >= .01 ether);

    players.push(msg.sender);
  }

  function pickWinner() public forManagerOnly {
    address winner = players[random() % players.length];
    
    payable(winner).transfer(address(this).balance);

    resetContractState();
  }

  function getPlayers() public view returns (address[] memory) {
    return players;
  }

  function random() private view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

  function resetContractState() private {
    players = new address[](0);
  }

  modifier forManagerOnly() {
    require(msg.sender == manager);
    _;
  }
}