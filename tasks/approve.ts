import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken, SampleNFT } from "../types";

export const approveERC20 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  contractAddress: string,
  spender: string,
  amountStr: string
) => {
  const contractFactory = await ethers.getContractFactory(
    "SampleToken",
    signer
  );

  const amount = ethers.BigNumber.from(amountStr);
  const contract = (await contractFactory.attach(
    contractAddress
  )) as SampleToken;

  const tx = await contract.approve(spender, amount);
  await tx.wait();

  console.log(`ERC20 Token Approved`);
  console.log(`ERC20 Token Address: ${contractAddress}`);
  console.log(`Spender: ${spender}`);
  console.log(`Amount: ${amount.toString()}`);
};

export const approveERC721 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  contractAddress: string,
  spender: string,
  idStr: string
) => {
  const contractFactory = await ethers.getContractFactory("SampleNFT", signer);

  const id = ethers.BigNumber.from(idStr);
  const contract = (await contractFactory.attach(contractAddress)) as SampleNFT;

  const tx = await contract.approve(spender, id);
  await tx.wait();

  console.log(`ERC721 Token Approved`);
  console.log(`ERC721 Token Address: ${contractAddress}`);
  console.log(`Spender: ${spender}`);
  console.log(`ID: ${id.toString()}`);
};
