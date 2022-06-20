import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { utils } from "ethers";
import { keccak256 } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { AccessControl } from "../types";

const MINT_ROLE_TYPE = "mint" as const;
type ROLE_TYPES = typeof MINT_ROLE_TYPE;

const nameToRole = {
  [MINT_ROLE_TYPE]: keccak256(utils.toUtf8Bytes("MINTER_ROLE")),
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

  const tx = await contract.grantRole(nameToRole[role], accountAddress);
  const r = await tx.wait();
  console.log("r", r);

  console.log(
    `Granted a role of ${role} to account ${accountAddress} in contract ${contractAddress}`
  );
};
