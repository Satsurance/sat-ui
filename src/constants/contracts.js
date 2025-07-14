// src/constants/contracts.js
const NETWORKS = {
    BITLAYER_TESTNET: 200810,
    INK_TESTNET: 763373,
    BOB_TESTNET: 808813,
    LOCALHOST: 31337
}

const EPISODE_DURATION = (91 * 24 * 60 * 60) / 3; // 91 days / 3 in seconds

const SUPPORTED_NETWORKS =
{
    [NETWORKS.BOB_TESTNET]: {
        chainId: NETWORKS.BOB_TESTNET,
        name: 'BOB Sepolia',
        rpcUrls: ['https://bob-sepolia.rpc.gobob.xyz'],
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://bob-sepolia.explorer.gobob.xyz'],
    },
    [NETWORKS.INK_TESTNET]: {
        chainId: NETWORKS.INK_TESTNET,
        name: 'Ink Sepolia',
        rpcUrls: ['https://rpc-gel-sepolia.inkonchain.com'],
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://explorer-sepolia.inkonchain.com'],
    },
    [NETWORKS.BITLAYER_TESTNET]: {
        chainId: NETWORKS.BITLAYER_TESTNET,
        name: 'Bitlayer Testnet',
        rpcUrls: ['https://testnet-rpc.bitlayer.org'],
        nativeCurrency: {
            name: 'BTC',
            symbol: 'BTC',
            decimals: 18,
        },
        blockExplorerUrls: ['https://testnet-scan.bitlayer.org'],
    },
    ...(import.meta.env.DEV ? {
        [NETWORKS.LOCALHOST]: {
            chainId: NETWORKS.LOCALHOST,
            name: 'Localhost',
            rpcUrls: ['http://localhost:8545'],
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
            },
            blockExplorerUrls: ['http://localhost:8545'],
        }
    } : {})
};


const CONTRACTS = {
    [NETWORKS.BOB_TESTNET]: {
        INSURANCE_POOL: '0x9DC42e84c53518258e67275e93A8bCc58Fb41d41',
        SURS_TOKEN: '0xdE12e5a8eb598281E5D73F6d8cEe83176B751D2C',
        BTC_TOKEN: '0x1E4c8419bA7FA9A9A8c6d3E85158ff678e11d089',
        TIMELOCK: '0x055e79994459236e65E17068E429D6a5578a8711',
        GOVERNOR: '0x142D07E72c92def887eEC1c7D0E2F5765475827c',
        CLAIMER: '0x70D232AC86d09a586Cee9e1524084F4313980745',
        COVER_PURCHASER: '0xb3227beaC9e9E85003dC5c22591E3D50f0D48232',
        CONTROL_BOARD: '0x0000000000000000000000000000000000000000', // TODO: Add actual address
    },
    [NETWORKS.INK_TESTNET]: {
        INSURANCE_POOL: '0xDcf7abA5455190666AC39B87079051d138208A76',
        SURS_TOKEN: '0xA4578E67AF84Afdcd466315bAb60EB93BF052ef5',
        BTC_TOKEN: '0x15457083e65ee016C672dd8724b9A275C1DAC250',
        TIMELOCK: '0x2e6fD8a4A18A9129d7b8e2581dA810866fD5Ae14',
        GOVERNOR: '0x9AB040EEbD758da56d9c4Af41C061fA4E5349D20',
        CLAIMER: '0x17980406Da3CB02A4Ea0876fA8864A378145B572',
        COVER_PURCHASER: '0xc0A92fA2a634f84F6e294E2Fdd44aD4C5faD3b2B',
        CONTROL_BOARD: '0x0000000000000000000000000000000000000000', // TODO: Add actual address
    },
    [NETWORKS.BITLAYER_TESTNET]: {
        INSURANCE_POOL: '0x6F0ed23026e2D606079c838D6d30b1E936F51787',
        SURS_TOKEN: '0xF77757063afd7d8976A13A359EeDB2428c14A248',
        BTC_TOKEN: '0xf2e60aD832447323B0E28dBD4581079bF06f6404',
        TIMELOCK: '0x75916B9b986Fdc37b4d8A9eeE346b54E30CF947C',
        GOVERNOR: '0x43c9fF875AB1e8ca867859DDbba28D962DeE99E0',
        CLAIMER: '0x53243C478285779406C6f9F2FE02696b83471f8e',
        COVER_PURCHASER: '0x1397930814E12d98bbFFf4dD21a1F702356C56ac',
        CONTROL_BOARD: '0x0000000000000000000000000000000000000000', // TODO: Add actual address
    },
    [NETWORKS.LOCALHOST]: {
        INSURANCE_POOL: "0x1E1aA7692555eA8bc6ab8421Ad2CaA286527D356",
        SURS_TOKEN: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
        BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TIMELOCK: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
        GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        CLAIMER: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
        POOL_FACTORY: "0x4A679253410272dd5232B3Ff7cF5dbB88f295319",
        POSITION_NFT: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
        COVER_NFT: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
        COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        CONTROL_BOARD: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    }
}

export const getContractAddress = (contractName, networkId) => {
    if (!CONTRACTS[networkId]) {
        throw new Error(`Network ID ${networkId} not supported`)
    }

    const address = CONTRACTS[networkId][contractName]
    if (!address) {
        throw new Error(`Contract ${contractName} not found for network ${networkId}`)
    }

    return address
}

export { NETWORKS, SUPPORTED_NETWORKS, EPISODE_DURATION }