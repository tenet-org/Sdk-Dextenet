# Balancer Javascript SDK

A JavaScript SDK which provides commonly used utilties for interacting with Balancer Protocol V2.

## How to run the examples (Javascript)?

**In order to run the examples provided, you need to follow the next steps:**

1. ```git clone https://github.com/balancer-labs/balancer-sdk.git```
2. ```cd balancer-sdk```
3. ```cd balancer-js```
4. Create a .env file in the balancer-js folder
5. In the .env file you will need to define and initialize the following variables

   We have defined both Alchemy and Infura, because some of the examples use Infura, others use Alchemy. However, feel free to modify accordingly and use your favourite one.
   ALCHEMY_URL=[ALCHEMY HTTPS ENDPOINT]  
   INFURA=[Infura API KEY]  
   TRADER_KEY=[MetaMask PRIVATE KEY]  
   Some examples also require the following Tenderly config parameters to be defined:
   TENDERLY_ACCESS_KEY=[TENDERLY API ACCESS KEY]
   TENDERLY_PROJECT=[TENDERLY PROJECT NAME]
   TENDERLY_USER=[TENDERLY USERNAME]

6. Run 'npm run node', this runs a local Hardhat Network
7. Open a new terminal
8. cd to balancer-js
9. Install ts-node using: ```npm install ts-node```
10. Install tsconfig-paths using: ```npm install --save-dev tsconfig-paths```
11. Generate contracts using: ```npm run typechain:generate```
12. Run one of the provided examples (eg: npm run examples:run -- examples/join.ts)

## Installation

## Getting Started

```js
import { BalancerSDK, BalancerSdkConfig, Network } from '@balancer-labs/sdk';

const config: BalancerSdkConfig = {
  network: Network.MAINNET,
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA}`,
};
const balancer = new BalancerSDK(config);
```

In some examples we present a way to make end to end trades against mainnet state. To run them you will need to setup a localhost test node using tools like ganache, hardhat, anvil.

Installation instructions for:

- [Hardhat](https://hardhat.org/getting-started/#installation)

  To start a MAINNET forked node:

  - Set env var: `ALCHEMY_URL=[ALCHEMY HTTPS ENDPOINT for MAINNET]`
  - Run: `npm run node`

  To start a GOERLI forked node:

  - Set env var: `ALCHEMY_URL_GOERLI=[ALCHEMY HTTPS ENDPOINT for GOERLI]`
  - Run: `npm run node:goerli`

- [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil#installation) - use with caution, still experimental.

  To start a forked node:

  ```
  anvil -f FORKABLE_RPC_URL (optional pinned block: --fork-block-number XXX)
  ```

## Swaps Module

Exposes complete functionality for token swapping. An example of using the module with data fetched from the subgraph:

```js
// Uses SOR to find optimal route for a trading pair and amount
const route = balancer.swaps.findRouteGivenIn({
  tokenIn,
  tokenOut,
  amount,
  gasPrice,
  maxPools,
});

// Prepares transaction attributes based on the route
const transactionAttributes = balancer.swaps.buildSwap({
  userAddress,
  swapInfo: route,
  kind: 0, // 0 - givenIn, 1 - givenOut
  deadline,
  maxSlippage,
});

// Extract parameters required for sendTransaction
const { to, data, value } = transactionAttributes;

// Execution with ethers.js
const transactionResponse = await signer.sendTransaction({ to, data, value });
```

## SwapsService

The SwapsService provides function to query and make swaps using Balancer V2 liquidity.

```js
const swaps = new swapService({
  network: Network;
  rpcUrl: string;
});
```

## Examples

You can run each example with `npm run examples:run -- examples/swaps/swap.ts`
