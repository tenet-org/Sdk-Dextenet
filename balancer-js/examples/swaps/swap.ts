import { RPC_URLS } from './../../src/test/lib/utils';
/**
 * How to build a swap and send it using ethers.js
 *
 * How to run:
 * yarn example examples/swaps/swap.ts
 */
import dotenv from 'dotenv';

import { BalancerSDK, Network } from '@balancer-labs/sdk';
import { formatFixed } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';
import { reset } from 'examples/helpers/forked-utils';
import { Wallet } from '@ethersproject/wallet';

const tokenIn = '0xFA3C22C069B9556A4B2f7EcE1Ee3B467909f4864'; 
const tokenOut = '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd'; 
const amount = String(BigInt(0.004e18)); 

dotenv.config();

const sdk = new BalancerSDK({
  network: Network.TENET_TESTNET,
  rpcUrl: `https://rpc.testnet.tenet.org`,
});

const { swaps } = sdk;

const erc20Out = sdk.contracts.ERC20(tokenOut, sdk.provider);

async function swap() {

  const key = process.env.TRADER_KEY as string;

  const signer = new Wallet(key, sdk.sor.provider);
  const account = await signer.getAddress();

  const fetchPools = await sdk.swaps.sor.fetchPools();
  
  
  // Set exectution deadline to 60 seconds from now
  const deadline = String(Math.ceil(Date.now() / 1000) + 60);

  // Avoid getting rekt by setting low slippage from expected amounts out, 10 bsp = 0.1%
  const maxSlippage = 10;
  
  // Building the route payload
  const payload = await swaps.buildRouteExactIn(
    account,
    account,
    tokenIn, 
    tokenOut, 
    amount,
    {
      maxSlippage,
      deadline,
    }
  );


  // Extract parameters required for sendTransaction
  const { to, data, value } = payload;


  // Execution with ethers.js
  try {
    const balanceBefore = await erc20Out.balanceOf(account);


    

    await (
      await signer.sendTransaction({
        to,
        data,
        value,
      })
    ).wait();

    // check delta
    const balanceAfter = await erc20Out.balanceOf(account);

    console.log(
      `Amount of Coins received: ${formatFixed(
        balanceAfter.sub(balanceBefore),
        8
      )}`
    );
  } catch (err) {
    console.log(err);
  }
}

swap();
