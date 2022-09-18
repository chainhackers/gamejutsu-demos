import { ethers } from "ethers";
import arbiterContract from 'contracts/Arbiter.json';


export async function registerSessionAddress(provider: ethers.providers.Web3Provider, gameId:number, wallet: ethers.Wallet): Promise<void> {
    const contract = new ethers.Contract(arbiterContract.address, arbiterContract.abi, provider.getSigner());
    const gasEstimatedRedeem =  await contract.estimateGas.registerSessionAddress(gameId, wallet.address);
    return contract.registerSessionAddress(gameId, wallet.address, {gasLimit: gasEstimatedRedeem.mul(4)});
}

export async function getSessionWallet(gameId:number, address:string, registerAddressCallback: (wallet: ethers.Wallet) => Promise<void>): Promise<ethers.Wallet> {
    let localStorage = window.localStorage;
    let privateStore = `${address}_${gameId}_private`;
    let privateKey = localStorage.getItem(privateStore);
    if (privateKey) {
        return new ethers.Wallet(privateKey);
    }
    let wallet = ethers.Wallet.createRandom();
    await registerAddressCallback(wallet);
    localStorage.setItem(privateStore, wallet.privateKey);
    return wallet;
}

const domain = {
    name: "GameJutsu",
    version: "0.1",
    chainId: 137,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    salt: "0x920dfa98b3727bbfe860dd7341801f2e2a55cd7f637dea958edfc5df56c35e4d"
}

const types = { GameMove: [
    { name: "gameId", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "player", type: "address" },
    { name: "oldState", type: "bytes" },
    { name: "newState", type: "bytes" },
    { name: "move", type: "bytes" }
  ]
}

export async function signMove(gameMove:object, wallet: ethers.Wallet): Promise<string> {
    let signPromise = wallet._signTypedData(domain, types, gameMove)
    return signPromise;
}
