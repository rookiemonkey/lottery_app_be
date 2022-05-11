require("dotenv").config();
const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(__dirname, `contracts/${process.env.CONTRACT_FILE_NAME}`);
const contract = fs.readFileSync(contractPath, "utf8");

const input = {
  language: 'Solidity',
  sources: {
    [process.env.CONTRACT_FILE_NAME]: {
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

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[process.env.CONTRACT_FILE_NAME].Lottery;