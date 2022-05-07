import { expect } from "chai";
import { arrayify } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { Airdrop, Airdrop__factory } from "../typechain";

function toWei(value: Number) {
    return ethers.utils.parseEther(value.toString())
}

function fromWei(value: BigNumber) {
    return Number(ethers.utils.formatEther(value))
}

describe("Airdrop test", function () {
    let airdrop: Airdrop
    let signer: Signer
    let claimer: Signer

    beforeEach(async function () {
        [signer, claimer] = await ethers.getSigners()
        airdrop = await new Airdrop__factory(signer).deploy(await signer.getAddress())
    })

    describe("Deployment", async function () {
        it("Should deployed Airdrop", async function () {
            expect(airdrop.address).not.to.eq(null)
        })

        it("Should set the right owner", async function () {
            expect(await airdrop.owner()).to.eq(await signer.getAddress())
        })

    })

    describe("Claim Airdrop", function () {

        it("Should claim airdrop if signature has signed from signer", async function () {
            // Deposit REI to Airdrop contract
            const depositAmount = 1
            await signer.sendTransaction({ to: airdrop.address, value: toWei(depositAmount) })

            // Mock claimer data
            const id = 0
            const claimAmount = 0.1
            const deadline = Date.now() + 60 // + 1 minute 

            // hash data 
            const hash = ethers.utils.solidityKeccak256(
                ["address", "uint", "uint", "uint"],
                [await claimer.getAddress(), id, toWei(claimAmount), deadline]
            )
            const hashBinary = ethers.utils.arrayify(hash)

            // signer sign message
            const signature = await signer.signMessage(hashBinary)

            const tx = await airdrop.connect(claimer).claim(id, toWei(claimAmount), deadline, signature)
            const txComfirmed = await tx.wait()
            const event = txComfirmed.events?.find(e => e.event === 'Claim')
            const eventArg = event?.args

            expect(eventArg?.user).to.eq(await claimer.getAddress(), "Claimer address is wrong.")
            expect(eventArg?.id).to.eq(id, "Claimer id is wrong.")
            expect(fromWei(eventArg?.amount)).to.eq(claimAmount, "Claimer amount is wrong.")
        })
    })
})