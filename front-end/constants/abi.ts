export const ABI_STEALTH_ADDRESS = {
  Secp256k1: {
    address: "0x0c7B0766103bA2a6463f7b37cD19De2470B7B675",
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "derivePubKey",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "deriveAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKeyBob", type: "uint256" },
          { internalType: "uint256", name: "pubKeyAliceX", type: "uint256" },
          { internalType: "uint256", name: "pubKeyAliceY", type: "uint256" },
        ],
        name: "getStealthAddress",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "bytes", name: "", type: "bytes" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "uint256", name: "hashS", type: "uint256" },
        ],
        name: "getPrivateKeyOfStealthAddress",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
    ],
    contractName: "Secp256k1",
    path: "library",
  },
  StealthAddress: {
    address: "0xfEC411171a5acfb2CD15933714e9ACDcA12bB1c6",
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "x", type: "uint256" },
          { internalType: "uint256", name: "y", type: "uint256" },
        ],
        name: "setPublicKey",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_address", type: "address" },
        ],
        name: "getPublicKey",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "X", type: "uint256" },
              { internalType: "uint256", name: "Y", type: "uint256" },
            ],
            internalType: "struct PublicKey",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "privToPubKey",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "address", name: "to_address", type: "address" },
        ],
        name: "getStealthAddress",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "bytes", name: "", type: "bytes" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "uint256", name: "hash", type: "uint256" },
        ],
        name: "getPrivateKeyOfStealthAddress",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
    ],
    contractName: "StealthAddress",
    path: "stealth-address",
  },
};
