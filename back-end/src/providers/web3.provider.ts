import { ABI_MUSIC } from '@constants';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types/index';

const web3 = new Web3(`${process.env.NETWORK_RPC}`);

const newContract = (abi: any, address: string): Contract => {
  return new web3.eth.Contract(abi, address);
};

const getBlockByNumber = async (blockNumber: number) => {
  return await web3.eth.getBlock(blockNumber);
};

const MarketContract = newContract(ABI_MUSIC.MusicMarket.abi, ABI_MUSIC.MusicMarket.address);

export { web3, newContract, MarketContract, getBlockByNumber };
