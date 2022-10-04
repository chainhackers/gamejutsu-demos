import type { EthSdkConfig } from '@dethcrypto/eth-sdk'

const config: EthSdkConfig = {
  contracts: {
    polygon: {
      arbiter: '0x1f0b6DB015198028d57Eb89785Fc81637f1e72F5',
      checkersRules: '0x6eDe6F6f1ACa5e7A3bdc403EA0ca9889e2095486',
      tictactoeRules: '0xC6F81d6610A0b1bcb8cC11d50602D490b7624a96'
    },
  },
  "outputPath": "./.generated/contracts"
}

export default config