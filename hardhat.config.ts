import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "tsconfig-paths/register";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import {
  deployContract,
  DEFAULT_TOKEN_NAME,
  DEFAULT_SYMBOL_NAME,
} from "./tasks/deploy";
import { grantRole } from "./tasks/grant";

require("dotenv").config();

const privateKeys = (process.env.PRIVATE_KEYS ?? "").split(",");

task("deploy", "deploy contracts")
  .addParam("contract", "Contract to be deployed [erc20, erc721]")
  .addOptionalParam("name", "Token Name", DEFAULT_TOKEN_NAME)
  .addOptionalParam("symbol", "Token Symbol", DEFAULT_SYMBOL_NAME)
  .addOptionalParam("uri", "Token URI for ERC721")
  .setAction(async (args, hre) => {
    const [account] = await hre.ethers.getSigners();
    const {
      contract,
      name,
      symbol,
      uri: tokenURI,
    } = args as {
      contract: string;
      name: string;
      symbol: string;
      uri?: string;
    };

    await deployContract(contract, account, hre.ethers, name, symbol, tokenURI);
  });

task("grant", "Grant a role to user in contract")
  .addParam("contract", "Contract Address")
  .addParam("address", "Account Address")
  .addParam("role", "Role type [mint, burn]")
  .setAction(async (args, hre) => {
    const [account] = await hre.ethers.getSigners();
    const { contract, address, role } = args as {
      contract: string;
      address: string;
      role: string;
    };

    await grantRole(contract, address, role, account, hre.ethers);
  });

const config: HardhatUserConfig = {
  solidity: "0.8.14",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_JSONRPC_URL ?? "http://localhost:10002",
      accounts: [...privateKeys],
    },
    edge: {
      url: process.env.EDGE_JSONRPC_URL ?? "http://localhost:10002",
      accounts: [...privateKeys],
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
};

export default config;