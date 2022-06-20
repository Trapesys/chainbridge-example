import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken } from "../types";

export const balanceOf = async (
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"],
  contractAddress: string,
  account: string
) => {
  const contractFactory = await ethers.getContractFactory(
    "SampleToken",
    signer
  );

  const contract = (await contractFactory.attach(
    contractAddress
  )) as SampleToken;
  const amount = await contract.balanceOf(account);

  console.log(`ERC20 Token Address: ${contractAddress}`);
  console.log(`Account: ${account}`);
  console.log(`Balance: ${amount.toString()}`);
};
