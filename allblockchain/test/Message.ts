// test/Message.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Message } from "../typechain-types";

describe("Message", function () {
  let message: Message;

  beforeEach(async function () {
    const Message = await ethers.getContractFactory("Message");
    message = await Message.deploy();
    await message.waitForDeployment();
  });

  it("Should set and get the message correctly", async function () {
    const testMessage = "Hello, Blockchain!";
    await message.setMessage(testMessage);
    expect(await message.getMessage()).to.equal(testMessage);
  });
});