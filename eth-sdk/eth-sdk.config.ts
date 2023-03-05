import type { EthSdkConfig } from '@dethcrypto/eth-sdk'

const config: EthSdkConfig = {
  contracts: {
    polygon: {
      arbiter: '0xE3Dc7e9e1b57A4c91546b391e5Eb31f8B630122E',
      checkersRules: '0xEc27c5B570e6ddFfaEb6c33b4A6959c9aE97295a',
      ticTacToeRules: '0xC6F81d6610A0b1bcb8cC11d50602D490b7624a96'
    },
  },
  "outputPath": "./.generated/contracts"
}

export default config
