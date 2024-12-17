import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

export const [metaMask, hooks, metaMaskStore] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

// "use client";

// import { initializeConnector } from "@web3-react/core";
// import { MetaMask } from "@web3-react/metamask";

// export const [metaMask, metaMaskHooks, metaMaskStore] = initializeConnector<MetaMask>(
//   (actions) => new MetaMask(actions)
// );
