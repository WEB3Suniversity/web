/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  YiDengToken,
  YiDengTokenInterface,
} from "../../types/YiDengToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "teamWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marketingWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "communityWallet",
        type: "address",
      },
    ],
    name: "InitialDistributionCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "TokensSold",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKENS_PER_ETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "communityAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "teamWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "marketingWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "communityWallet",
        type: "address",
      },
    ],
    name: "distributeInitialTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialDistributionDone",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketingAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "remainingMintableSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "sellTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "teamAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040518060400160405280600c81526020016b2cb4a232b733902a37b5b2b760a11b81525060405180604001604052806002815260200161165160f21b815250816003908161006091906101ef565b50600461006d82826101ef565b5050506100866100816100fa60201b60201c565b6100fe565b606461009e6a0108b2a2c280290940000060146102ad565b6100a891906102d8565b60065560646100c36a0108b2a2c2802909400000600a6102ad565b6100cd91906102d8565b60075560646100e86a0108b2a2c2802909400000600a6102ad565b6100f291906102d8565b6008556102fa565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061017a57607f821691505b60208210810361019a57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156101ea57806000526020600020601f840160051c810160208510156101c75750805b601f840160051c820191505b818110156101e757600081556001016101d3565b50505b505050565b81516001600160401b0381111561020857610208610150565b61021c816102168454610166565b846101a0565b6020601f82116001811461025057600083156102385750848201515b600019600385901b1c1916600184901b1784556101e7565b600084815260208120601f198516915b828110156102805787850151825560209485019460019092019101610260565b508482101561029e5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b80820281158282048414176102d257634e487b7160e01b600052601160045260246000fd5b92915050565b6000826102f557634e487b7160e01b600052601260045260246000fd5b500490565b6112dc806103096000396000f3fe6080604052600436106101405760003560e01c80636c11bcd3116100bb578063a9059cbb11610077578063a9059cbb14610351578063bc6e660414610371578063d53b4ab414610387578063dd62ed3e1461039d578063e086e5ec146103bd578063e492c5a9146103d2578063f2fde38b146103f257005b80636c11bcd31461029a57806370a08231146102ba578063715018a6146102da5780638da5cb5b146102ef57806395d89b411461031c578063a457c2d71461033157005b80630535ec771461014257806306fdde0314610171578063095ea7b314610193578063150d283d146101b357806315f0c220146101bb57806318160ddd146101df57806323b872dd146101f4578063313ce5671461021457806332cb6b0c14610230578063349f0b901461024f57806339509351146102645780636816521a14610284575b005b34801561014e57600080fd5b5060095461015c9060ff1681565b60405190151581526020015b60405180910390f35b34801561017d57600080fd5b50610186610412565b6040516101689190611055565b34801561019f57600080fd5b5061015c6101ae3660046110bf565b6104a4565b6101406104be565b3480156101c757600080fd5b506101d160075481565b604051908152602001610168565b3480156101eb57600080fd5b506002546101d1565b34801561020057600080fd5b5061015c61020f3660046110e9565b6105c3565b34801561022057600080fd5b5060405160128152602001610168565b34801561023c57600080fd5b506101d16a0108b2a2c280290940000081565b34801561025b57600080fd5b506101d16105e7565b34801561027057600080fd5b5061015c61027f3660046110bf565b61060c565b34801561029057600080fd5b506101d160065481565b3480156102a657600080fd5b506101406102b5366004611126565b61062e565b3480156102c657600080fd5b506101d16102d536600461113f565b610805565b3480156102e657600080fd5b50610140610820565b3480156102fb57600080fd5b50610304610834565b6040516001600160a01b039091168152602001610168565b34801561032857600080fd5b50610186610843565b34801561033d57600080fd5b5061015c61034c3660046110bf565b610852565b34801561035d57600080fd5b5061015c61036c3660046110bf565b6108cd565b34801561037d57600080fd5b506101d16103e881565b34801561039357600080fd5b506101d160085481565b3480156103a957600080fd5b506101d16103b8366004611161565b6108db565b3480156103c957600080fd5b50610140610906565b3480156103de57600080fd5b506101406103ed366004611194565b610951565b3480156103fe57600080fd5b5061014061040d36600461113f565b610a38565b606060038054610421906111d7565b80601f016020809104026020016040519081016040528092919081815260200182805461044d906111d7565b801561049a5780601f1061046f5761010080835404028352916020019161049a565b820191906000526020600020905b81548152906001019060200180831161047d57829003601f168201915b5050505050905090565b6000336104b2818585610aae565b60019150505b92915050565b600034116105035760405162461bcd60e51b815260206004820152600d60248201526c09aeae6e840e6cadcc8408aa89609b1b60448201526064015b60405180910390fd5b60006105116103e834611227565b90506a0108b2a2c28029094000008161052960025490565b610533919061123e565b111561057b5760405162461bcd60e51b8152602060048201526017602482015276576f756c6420657863656564206d617820737570706c7960481b60448201526064016104fa565b6105853382610bd3565b604080513481526020810183905233917f8fafebcaf9d154343dad25669bfa277f4fbacd7ac6b0c4fed522580e040a0f33910160405180910390a250565b6000336105d1858285610c80565b6105dc858585610cfa565b506001949350505050565b60006105f260025490565b610607906a0108b2a2c2802909400000611251565b905090565b6000336104b281858561061f83836108db565b610629919061123e565b610aae565b6000811161067e5760405162461bcd60e51b815260206004820152601d60248201527f416d6f756e74206d7573742062652067726561746572207468616e203000000060448201526064016104fa565b8061068833610805565b10156106cd5760405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b60448201526064016104fa565b60006106db6103e883611264565b90508047101561072d5760405162461bcd60e51b815260206004820152601c60248201527f496e73756666696369656e742045544820696e20636f6e74726163740000000060448201526064016104fa565b6107373383610e8c565b604051600090339083908381818185875af1925050503d8060008114610779576040519150601f19603f3d011682016040523d82523d6000602084013e61077e565b606091505b50509050806107c55760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b60448201526064016104fa565b604080518481526020810184905233917f2dcf9433d75db0d8b1c172641f85e319ffe4ad22e108a95d1847ceb906e5195d910160405180910390a2505050565b6001600160a01b031660009081526020819052604090205490565b610828610fa4565b6108326000611003565b565b6005546001600160a01b031690565b606060048054610421906111d7565b6000338161086082866108db565b9050838110156108c05760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016104fa565b6105dc8286868403610aae565b6000336104b2818585610cfa565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61090e610fa4565b610916610834565b6001600160a01b03166108fc479081150290604051600060405180830381858888f1935050505015801561094e573d6000803e3d6000fd5b50565b610959610fa4565b60095460ff16156109b65760405162461bcd60e51b815260206004820152602160248201527f496e697469616c20646973747269627574696f6e20616c726561647920646f6e6044820152606560f81b60648201526084016104fa565b6109c283600654610bd3565b6109ce82600754610bd3565b6109da81600854610bd3565b6009805460ff19166001179055604080516001600160a01b038581168252848116602083015283168183015290517f4864f7df2cd1c07972b3dbf1a98de81ddd7d784caf0078d5e5e372b219f6695c916060908290030190a1505050565b610a40610fa4565b6001600160a01b038116610aa55760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104fa565b61094e81611003565b6001600160a01b038316610b105760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016104fa565b6001600160a01b038216610b715760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016104fa565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b038216610c295760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104fa565b8060026000828254610c3b919061123e565b90915550506001600160a01b03821660008181526020818152604080832080548601905551848152600080516020611287833981519152910160405180910390a35050565b6000610c8c84846108db565b90506000198114610cf45781811015610ce75760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016104fa565b610cf48484848403610aae565b50505050565b6001600160a01b038316610d5e5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016104fa565b6001600160a01b038216610dc05760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016104fa565b6001600160a01b03831660009081526020819052604090205481811015610e385760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016104fa565b6001600160a01b0384811660008181526020818152604080832087870390559387168083529184902080548701905592518581529092600080516020611287833981519152910160405180910390a3610cf4565b6001600160a01b038216610eec5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016104fa565b6001600160a01b03821660009081526020819052604090205481811015610f605760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016104fa565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192916000805160206112878339815191529101610bc6565b33610fad610834565b6001600160a01b0316146108325760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fa565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b602081526000825180602084015260005b818110156110835760208186018101516040868401015201611066565b506000604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b03811681146110ba57600080fd5b919050565b600080604083850312156110d257600080fd5b6110db836110a3565b946020939093013593505050565b6000806000606084860312156110fe57600080fd5b611107846110a3565b9250611115602085016110a3565b929592945050506040919091013590565b60006020828403121561113857600080fd5b5035919050565b60006020828403121561115157600080fd5b61115a826110a3565b9392505050565b6000806040838503121561117457600080fd5b61117d836110a3565b915061118b602084016110a3565b90509250929050565b6000806000606084860312156111a957600080fd5b6111b2846110a3565b92506111c0602085016110a3565b91506111ce604085016110a3565b90509250925092565b600181811c908216806111eb57607f821691505b60208210810361120b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176104b8576104b8611211565b808201808211156104b8576104b8611211565b818103818111156104b8576104b8611211565b60008261128157634e487b7160e01b600052601260045260246000fd5b50049056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122028dee132a4cf412a74c5cb1a33890d1e3518eaf603254e39695b8f9dcdded4d364736f6c634300081c0033";

type YiDengTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: YiDengTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class YiDengToken__factory extends ContractFactory {
  constructor(...args: YiDengTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      YiDengToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): YiDengToken__factory {
    return super.connect(runner) as YiDengToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YiDengTokenInterface {
    return new Interface(_abi) as YiDengTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): YiDengToken {
    return new Contract(address, _abi, runner) as unknown as YiDengToken;
  }
}
