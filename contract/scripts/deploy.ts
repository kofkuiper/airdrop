import { ethers } from 'hardhat'
import { Airdrop__factory } from '../typechain'

// const signer = ''

async function main() {
  const [signer] = await ethers.getSigners()
  const C = new Airdrop__factory(signer)
  const c = await C.deploy(signer.address)
  await c.deployed()

  console.log('Airdrop deployed to:', c.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
