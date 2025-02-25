import type { AddEthereumChainParameter } from "@web3-react/types";

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const CELO: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Celo",
  symbol: "CELO",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  // Check that 'nativeCurrency' and 'blockExplorerUrls' exist on the chain information
  return (
    chainInformation &&
    (chainInformation as ExtendedChainInformation)?.nativeCurrency !==
      undefined &&
    (chainInformation as ExtendedChainInformation)?.blockExplorerUrls !==
      undefined
  );
}

const getInfuraUrlFor = (network: string) =>
  process.env.infuraKey
    ? `https://${network}.infura.io/v3/${process.env.infuraKey}`
    : "";
const getAlchemyUrlFor = (network: string) =>
  process.env.alchemyKey
    ? `https://${network}.alchemyapi.io/v2/${process.env.alchemyKey}`
    : "";

type ChainConfig = {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
};

export const MAINNET_CHAINS: ChainConfig = {
  1: {
    urls: [
      getInfuraUrlFor("mainnet"),
      getAlchemyUrlFor("eth-mainnet"),
      "https://cloudflare-eth.com",
    ].filter(Boolean),
    name: "Mainnet",
  },
  10: {
    urls: [
      getInfuraUrlFor("optimism-mainnet"),
      "https://mainnet.optimism.io",
    ].filter(Boolean),
    name: "Optimism",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  42161: {
    urls: [
      getInfuraUrlFor("arbitrum-mainnet"),
      "https://arb1.arbitrum.io/rpc",
    ].filter(Boolean),
    name: "Arbitrum One",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  137: {
    urls: [
      getInfuraUrlFor("polygon-mainnet"),
      "https://polygon-rpc.com",
    ].filter(Boolean),
    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  42220: {
    urls: ["https://forno.celo.org"],
    name: "Celo",
    nativeCurrency: CELO,
    blockExplorerUrls: ["https://explorer.celo.org"],
  },
  11155111: {
    // Sepolia Testnet
    urls: [getInfuraUrlFor("sepolia")].filter(Boolean),
    name: "Sepolia1",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  11155112: {
    // Sepolia Testnet
    urls: [getInfuraUrlFor("sepolia")].filter(Boolean),
    name: "Sepolia",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

export const TESTNET_CHAINS: ChainConfig = {
  5: {
    urls: [getInfuraUrlFor("goerli")].filter(Boolean),
    name: "Görli",
  },
  31337: {
    urls: ["http://127.0.0.1:8545"], // Hardhat 本地链的 RPC 地址
    name: "Hardhat Local Network", // 你可以为本地网络自定义名称
    nativeCurrency: ETH, // 使用 ETH 作为本地货币
    blockExplorerUrls: ["http://localhost:8545"], // 本地网络的 block explorer 地址
  },
  1337: {
    urls: ["https://远程.ip"],
    nativeCurrency: ETH,
    name: "Location",
  },
  420: {
    urls: [
      getInfuraUrlFor("optimism-goerli"),
      "https://goerli.optimism.io",
    ].filter(Boolean),
    name: "Optimism Goerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://goerli-explorer.optimism.io"],
  },
  421613: {
    urls: [
      getInfuraUrlFor("arbitrum-goerli"),
      "https://goerli-rollup.arbitrum.io/rpc",
    ].filter(Boolean),
    name: "Arbitrum Goerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://testnet.arbiscan.io"],
  },
  80001: {
    urls: [getInfuraUrlFor("polygon-mumbai")].filter(Boolean),
    name: "Polygon Mumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
  44787: {
    urls: ["https://alfajores-forno.celo-testnet.org"],
    name: "Celo Alfajores",
    nativeCurrency: CELO,
    blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
  },
};

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{
  [chainId: number]: string[];
}>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  if (chainId === -1) {
    // Handle the default chain case, you can return any default values here.
    return {
      chainId: 1, // Default to Mainnet (you can adjust this to whatever is the default for your app)
      chainName: "Mainnet",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_KEY"], // Replace with your own Infura or RPC URL
      blockExplorerUrls: ["https://etherscan.io"],
    };
  }

  const chainInformation = CHAINS[chainId];

  if (!chainInformation) {
    console.error(`No chain information found for chainId ${chainId}`);
    return chainId; // Return the chainId if no information is found
  }

  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId; // Return the chainId for basic chain information
  }
}
