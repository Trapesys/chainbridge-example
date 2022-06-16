import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken } from "../types";

const TYPE_ERC20 = "erc20" as const;
const TYPE_ERC721 = "erc721" as const;
type CONTRACT_TYPES = typeof TYPE_ERC20 | typeof TYPE_ERC721;

export const DEFAULT_TOKEN_NAME = "SampleToken";
export const DEFAULT_SYMBOL_NAME = "ST";

const deployERC20 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  name: string,
  symbol: string
): Promise<string> => {
  const contractFactory = await ethers.getContractFactory(
    "SampleToken",
    signer
  );
  const contract = (await contractFactory.deploy(name, symbol)) as SampleToken;

  console.log(`ERC20 contract has been deployed`);
  console.log(`Address: ${contract.address}`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);

  return contract.address;
};

const deployERC721 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  name: string,
  symbol: string,
  baseURI: string
): Promise<string> => {
  const contractFactory = await ethers.getContractFactory("SampleNFT", signer);
  const contract = (await contractFactory.deploy(
    name,
    symbol,
    baseURI
  )) as SampleToken;

  console.log(`ERC721 contract has been deployed`);
  console.log(`Address: ${contract.address}`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Base URI: ${baseURI}`);

  return contract.address;
};

export const deployContract = async (
  type: CONTRACT_TYPES | string,
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  name: string,
  symbol: string,
  baseURI?: string
): Promise<string> => {
  switch (type.toLowerCase()) {
    case "erc20":
      return deployERC20(signer, ethers, name, symbol);
    case "erc721":
      if (baseURI === undefined) {
        throw new Error(`Base URI can't be empty`);
      }

      return deployERC721(signer, ethers, name, symbol, baseURI);
    default:
      throw new Error(`invalid contract type: ${type}`);
  }
};
