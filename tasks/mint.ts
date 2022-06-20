import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken, SampleNFT } from "../types";

export const mintERC20 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  contractAddress: string,
  recipient: string,
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

  const tx = await contract.mint(recipient, amount);
  await tx.wait();

  console.log(`ERC20 Token Minted`);
  console.log(`ERC20 Token Address: ${contractAddress}`);
  console.log(`Amount: ${amount.toString()}`);
  console.log(`Recipient: ${recipient}`);
};

export const mintERC721 = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  contractAddress: string,
  recipient: string,
  idStr: string,
  data: string
) => {
  const contractFactory = await ethers.getContractFactory("SampleNFT", signer);

  const id = ethers.BigNumber.from(idStr);
  const contract = (await contractFactory.attach(contractAddress)) as SampleNFT;

  const tx = await contract.mint(recipient, id, data);
  await tx.wait();

  console.log(`ERC721 Token Minted`);
  console.log(`ERC721 Token Address: ${contractAddress}`);
  console.log(`ID: ${id.toString()}`);
  console.log(`Data: ${data}`);
  console.log(`Recipient: ${recipient}`);
};
