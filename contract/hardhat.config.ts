import * as dotenv from 'dotenv'

import { HardhatUserConfig, subtask } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'solidity-coverage'
const {
    getEtherscanEndpoints,
} = require('@nomiclabs/hardhat-etherscan/dist/src/network/prober')

dotenv.config()

const chainConfig: any = {
  rei: {
      chainId: 55555,
      urls: {
          apiURL: 'https://reiscan.com/api',
          browserURL: 'https://reiscan.com/'
      }
  }
}

subtask('verify:get-etherscan-endpoint').setAction(async (_, { network }) =>
    getEtherscanEndpoints(network.provider, network.name, chainConfig)
)

const config: HardhatUserConfig = {
  solidity: '0.8.13',
  networks: {
    rei: {
      url: 'https://rei-rpc.moonrhythm.io',
      chainId: 55555,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    reitestnet: {
      url: 'https://rei-testnet-rpc.moonrhythm.io',
      chainId: 55556,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: ':D',
  },
}

export default config
