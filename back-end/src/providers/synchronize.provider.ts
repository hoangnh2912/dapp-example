import { Constant, logger } from '@constants';
import { Synchronize } from '@schemas';
import cron from 'node-cron';
import { EventData } from 'web3-eth-contract';
import { MarketContract, getBlockByNumber, web3 } from '.';

const globalVariable: any = global;

globalVariable.isSyncingGetDataFromSmartContract = false;
const onJobGetDataFromSmartContract = async () => {
  try {
    logger.info(
      'onJobGetDataFromSmartContract:' + globalVariable.isSyncingGetDataFromSmartContract,
    );
    if (globalVariable.isSyncingGetDataFromSmartContract) return;
    globalVariable.isSyncingGetDataFromSmartContract = true;
    const lastSynchronize = await Synchronize.findOne().sort({ last_block_number: -1 }).limit(1);
    const last_block_number = (lastSynchronize?.last_block_number || 0) + 1;

    if (!lastSynchronize?.last_block_number) {
      await Synchronize.create({
        last_block_number: 33395644,
      });
      globalVariable.isSyncingGetDataFromSmartContract = false;
      return;
    }
    const listTxHash: string[] = [];
    const last_block_number_onchain = Math.min(
      await web3.eth.getBlockNumber(),
      last_block_number + 100000,
    );
    logger.info(`Synchronizing from ${last_block_number} to ${last_block_number_onchain}`);
    await synchronizeMarket(last_block_number, last_block_number_onchain, listTxHash);
    if (listTxHash.length > 0) {
      await Synchronize.create({
        last_block_number: last_block_number_onchain,
        transactions: listTxHash,
      });
      logger.info(`Synchronized ${listTxHash.length} transactions`);
    } else {
      if (last_block_number_onchain - last_block_number > 500) {
        await Synchronize.create({
          last_block_number: last_block_number_onchain,
          transactions: [],
        });
      }
    }
  } catch (error: any) {
    logger.error(`onJobGetDataFromSmartContract: ${error.message}`);
  }
  globalVariable.isSyncingGetDataFromSmartContract = false;
};

const sortByTransactionIndex = (a: EventData, b: EventData) =>
  a.transactionIndex - b.transactionIndex;

const synchronizeMarket = async (
  last_block_number_sync: number,
  last_block_number_onchain: number,
  listTxHash: string[],
) => {
  const marketService = {
    listSong: async (...args: any) => {
      console.log(`listSong: ${args}`);
    },
    createBuyHistory: async (...args: any) => {
      console.log(`createBuyHistory: ${args}`);
    },
  };
  const getPastEventsConfig = {
    fromBlock: last_block_number_sync,
    toBlock: last_block_number_onchain,
  };
  const [eventListSong, eventBuySong] = await Promise.all([
    MarketContract.getPastEvents(Constant.MUSIC_MARKET_EVENT.ListSong, getPastEventsConfig),
    MarketContract.getPastEvents(Constant.MUSIC_MARKET_EVENT.BuySong, getPastEventsConfig),
  ]);
  logger.info(`Synchronizing ${eventListSong.length} list song events`);
  logger.info(`Synchronizing ${eventBuySong.length} buy song events`);
  const listListSongUpdate = eventListSong.sort(sortByTransactionIndex).map(e => ({
    id: e.returnValues['id'],
    seller: e.returnValues['seller'],
    price: web3.utils.fromWei(e.returnValues['price'], 'ether'),
    amount: e.returnValues['amount'],
    uri: e.returnValues['uri'],
    transactionHash: e.transactionHash,
    blockNumber: e.blockNumber,
  }));

  const listBuySongUpdate = eventBuySong.sort(sortByTransactionIndex).map(e => ({
    id: e.returnValues['id'],
    buyer: e.returnValues['buyer'],
    transactionHash: e.transactionHash,
    blockNumber: e.blockNumber,
  }));

  listTxHash.push(...eventListSong.map(e => e.transactionHash));
  listTxHash.push(...eventBuySong.map(e => e.transactionHash));

  for (const priceUpdate of listListSongUpdate) {
    try {
      const blockData = await getBlockByNumber(priceUpdate.blockNumber);
      await marketService.listSong(
        priceUpdate.id,
        priceUpdate.seller.toLowerCase(),
        priceUpdate.price,
        priceUpdate.amount,
        priceUpdate.uri,
        priceUpdate.transactionHash,
        blockData.timestamp,
      );
    } catch (error: any) {
      logger.error(`Can not update market for music: ${priceUpdate.id}, error: ${error.message}`);
    }
  }

  for (const buyUpdate of listBuySongUpdate) {
    try {
      const blockData = await getBlockByNumber(buyUpdate.blockNumber);
      await marketService.createBuyHistory(
        buyUpdate.id,
        buyUpdate.buyer,
        buyUpdate.transactionHash,
        blockData.timestamp,
      );
    } catch (error: any) {
      logger.error(`Can not update market for music: ${buyUpdate.id}, error: ${error.message}`);
    }
  }
};

const startSynchronizeDataFromSmartContract = () => {
  cron.schedule('*/6 * * * * *', onJobGetDataFromSmartContract);
};

export { startSynchronizeDataFromSmartContract };
