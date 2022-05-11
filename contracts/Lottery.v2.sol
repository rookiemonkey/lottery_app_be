// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
 
contract Lottery {
  address public manager;
  address public previousWinner;
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

    previousWinner = winner;

    resetContractState();
  }

  // v2 change: returns the address of the previous winner
  function getWinner() public forManagerOnly returns (address) {
    return previousWinner;
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