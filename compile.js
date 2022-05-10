const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(__dirname, 'contracts/Lottery.sol');
const contract = fs.readFileSync(contractPath, "utf8");

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: contract,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;