const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let lottery;
let manager;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  manager = accounts.shift()

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: manager, gas: '1000000' })
})

describe("Lottery", () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('has a manager', async () => {
    assert.equal(manager, await lottery.methods.manager().call())
  })

  it('allows one account to enter', async () => {
    const playerToEnter = accounts[0]

    await lottery.methods.enter().send({ from: playerToEnter, value: web3.utils.toWei('0.02', 'ether') })

    const players = await lottery.methods.getPlayers().call();

    assert.equal(players.length,1)
    assert.equal(playerToEnter, players[0])
  })

  it('allows multiple accounts to enter', async () => {
    for (playerToEnter of accounts) {
      await lottery.methods.enter().send({ from: playerToEnter, value: web3.utils.toWei('0.02', 'ether') })
    }

    const players = await lottery.methods.getPlayers().call();

    assert.equal(players.length, accounts.length)
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: '100' })
      assert(false);
    }

    catch (e) { assert(e); }
  })

  it('can show the players', async () => {
    for (playerToEnter of accounts) {
      await lottery.methods.enter().send({ from: playerToEnter, value: web3.utils.toWei('0.02', 'ether') })
    }

    const players = await lottery.methods.getPlayers().call();

    players.forEach((player, index) => assert.equal(player, accounts[index]))
  })

  it('allows only manager to pick the winner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] })
      assert(false);
    }

    catch(e) { assert(e); }
  })

  // doesn't tests the randomness of the random method
  it('sends money to the winner and resets the player', async () => {
    const winningPlayer = accounts[0]

    await lottery.methods.enter().send({ from: winningPlayer, value: web3.utils.toWei('2', 'ether') })
    const winningPlayerBalanceAfterEntering = await web3.eth.getBalance(winningPlayer);

    await lottery.methods.pickWinner().send({ from: manager })
    const winningPlayerBalanceAfterWinning = await web3.eth.getBalance(winningPlayer)

    const players = await lottery.methods.getPlayers().call();
    const lotteryPrice = winningPlayerBalanceAfterWinning - winningPlayerBalanceAfterEntering

    assert(lotteryPrice > web3.utils.toWei('1.8', 'ether')); // assuming 0.2 is  for the gas
    assert(players.length == 0)
  })
})