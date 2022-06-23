import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken, AccessControl } from "../types";

const MINT_ROLE_TYPE = "mint" as const;
type ROLE_TYPES = typeof MINT_ROLE_TYPE;

const getRole = async (
  ethers: HardhatRuntimeEnvironment["ethers"],
  address: string,
  role: ROLE_TYPES
): Promise<string> => {
  const contractFactory = await ethers.getContractFactory("SampleToken");
  const contract = contractFactory.attach(address) as SampleToken;

  switch (role) {
    case MINT_ROLE_TYPE:
      return contract.MINTER_ROLE();
  }
};

export const grantRole = async (
  contractAddress: string,
  accountAddress: string,
  role: ROLE_TYPES | string,
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"]
) => {
  if (role !== MINT_ROLE_TYPE) {
    throw new Error(`invalid role type: ${role}`);
  }

  const contract = (await ethers.getContractAt(
    "AccessControl",
    contractAddress,
    signer
  )) as AccessControl;

  const tx = await contract.grantRole(
    await getRole(ethers, contractAddress, role as any),
    accountAddress
  );
  await tx.wait();

  console.log(`Grant a role`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`Account: ${accountAddress}`);
  console.log(`Role: ${role}`);
};
