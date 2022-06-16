# chainbridge-example

This repository has some contracts and scripts to setup ChainBridge for ERC20/ERC721 token transfer.

## How to start

```bash
$ git clone https://github.com/Trapesys/chainbridge-example.git
$ cd chainbridge-example
$ npm i
```

Please set private keys and JSONRPC URL in .env file

## Deploy ERC20/ERC721 contracts

```bash
# ERC20
$ npx hardhat deploy --contract erc20 --name SampleToken --symbol ST

# ERC721
$ npx hardhat deploy --contract erc721 --name SampleNFT --symbol ST --uri http://example.com/
```

## Grant mint/burn role to an account

```bash
# Grant mint role
$ npx hardhat grant --role mint --contract [CONTRACT_ADDRESS] --address [ACCOUNT_ADDRESS]

# Grant burn role
$ npx hardhat grant --role burn --contract [CONTRACT_ADDRESS] --address [ACCOUNT_ADDRESS]
```
