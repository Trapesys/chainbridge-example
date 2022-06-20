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
import { mintERC20, mintERC721 } from "./tasks/mint";
import { balanceOf } from "./tasks/balance";

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
  .addParam("role", "Role type [mint]")
  .setAction(async (args, hre) => {
    const [account] = await hre.ethers.getSigners();
    const { contract, address, role } = args as {
      contract: string;
      address: string;
      role: string;
    };

    await grantRole(contract, address, role, account, hre.ethers);
  });

task("mint", "Mint a new token")
  .addParam("type", "Token Type [erc20,erc721]")
  .addParam("contract", "Contract Address")
  .addParam("address", "Account Address")
  .addOptionalParam("amount", "Amount of new token for ERC20")
  .addOptionalParam("id", "ID of new token for ERC721")
  .addOptionalParam("data", "Metadata (tokenURI) for ERC721")
  .setAction(async (args, hre) => {
    const [account] = await hre.ethers.getSigners();
    const { type, contract, address, amount, id, data } = args as {
      type: string;
      contract: string;
      address: string;
      amount?: string;
      id?: string;
      data?: string;
    };

    switch (type.toLowerCase()) {
      case "erc20":
        if (!amount) {
          throw new Error(`"amount" is required`);
        }

        return mintERC20(account, hre.ethers, contract, address, amount);
      case "erc721":
        if (!id) {
          throw new Error(`"id" is required`);
        }
        if (!data) {
          throw new Error(`"data" is required`);
        }

        return mintERC721(account, hre.ethers, contract, address, id, data);
      default:
        throw new Error(`invalid contract type: ${type}`);
    }
  });

task("balance", "Show token balance")
  .addParam("contract", "Contract Address")
  .addParam("address", "Account Address")
  .setAction(async (args, hre) => {
    const [account] = await hre.ethers.getSigners();
    const { contract, address } = args as {
      contract: string;
      address: string;
    };

    await balanceOf(account, hre.ethers, contract, address);
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
