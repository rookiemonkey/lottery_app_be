require("dotenv").config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

// spawn instance of provider
const provider = new HDWalletProvider(process.env.PROVIDER_MNEMONIC, process.env.PROVIDER_LINK)

// connect web3 to the provider
const web3 = new Web3(provider);

(async function () {
  try {
    const accounts = await web3.eth.getAccounts();
    const accountToDeployTheContract = accounts[0];

    console.log(`Attempting to deploy from ${accountToDeployTheContract}`)

    const contract = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object, arguments: [] })
      .send({ from: accountToDeployTheContract, gas: '1000000' })

    console.log(`Interface:`, JSON.stringify(abi, null, 4))
    console.log(`Contract Deployed to ${contract.options.address}`)

    provider.engine.stop();
  }

  catch(e) {
    console.log(e)
  }
})()