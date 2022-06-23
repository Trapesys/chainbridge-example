import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SampleToken, AccessControl, SampleNFT } from "../types";

const MINT_ROLE_TYPE = "mint" as const;
const BURN_ROLE_TYPE = "burn" as const;
type ROLE_TYPES = typeof MINT_ROLE_TYPE | typeof BURN_ROLE_TYPE;

const getRole = async (
  ethers: HardhatRuntimeEnvironment["ethers"],
  address: string,
  role: ROLE_TYPES
): Promise<string> => {
  const contractFactory = await ethers.getContractFactory("SampleNFT");
  const contract = contractFactory.attach(address) as SampleNFT;

  switch (role) {
    case MINT_ROLE_TYPE:
      return contract.MINTER_ROLE();
    case BURN_ROLE_TYPE:
      return contract.BURNER_ROLE();
  }
};

export const grantRole = async (
  contractAddress: string,
  accountAddress: string,
  role: ROLE_TYPES | string,
  signer: SignerWithAddress,
  ethers: HardhatRuntimeEnvironment["ethers"]
) => {
  if (role !== MINT_ROLE_TYPE && role !== BURN_ROLE_TYPE) {
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
