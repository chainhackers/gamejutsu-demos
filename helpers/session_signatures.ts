import { ethers } from "ethers";
import arbiterContract from 'contracts/arbiter.json';

export function getSessionWallet(address:string, gameId:number): ethers.Wallet {
    let localStorage = window.localStorage;
    let privateStore = `${address}_${gameId}_private`;
    let privateKey = localStorage.getItem(privateStore);
    if (privateKey) {
        return new ethers.Wallet(privateKey);
    }
    let randomWallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, randomWallet.privateKey);
    return randomWallet;
}

export async function setSessionKey(gameId:number, wallet: ethers.Wallet): Promise<void> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(arbiterContract.address, arbiterContract.abi, provider.getSigner());
    const gasEstimatedRedeem =  await contract.estimateGas.setSessionKey(gameId, wallet.address);
    return await contract.setSessionKey(gameId, wallet.address, {gasLimit: gasEstimatedRedeem.mul(4)});
}

export async function getSessionKeys(gameId:number): Promise<string[]> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(arbiterContract.address, arbiterContract.abi, provider.getSigner());
    const gasEstimatedRedeem =  await contract.estimateGas.getSessionKeys(gameId);
    return await contract.getSessionKeys(gameId, {gasLimit: gasEstimatedRedeem.mul(4)});
}

// All properties on a domain are optional
const domain = {
    // name: 'Ether Mail',
    // version: '1',
    // chainId: 1,
    // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

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

// ethereum.on('accountsChanged', this.handleAccountsChanged);
// ethereum.on('chainChanged', this.handleChainChanged);

// export function _handleChainChanged(chainId: string) {
//     // We recommend reloading the page, unless you must do otherwise
//     //window.location.reload();
//     console.log("chainId", chainId);
// };

// export function _handleAccountsChanged(accounts: string[]) {
//     console.log("accounts", accounts);
//     if (accounts.length == 0) {
//       let ethAccount = null;
//     } else {
//       let ethAccount = accounts[0];
//     }      
// };
