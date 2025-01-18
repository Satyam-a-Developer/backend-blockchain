// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const Message = await ethers.getContractFactory("Message");
  const message = await Message.deploy();
  await message.waitForDeployment();

  console.log("Message contract deployed to:", await message.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });