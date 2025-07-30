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
        id: NETWORKS.BOB_TESTNET,
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
        id: NETWORKS.INK_TESTNET,
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
        id: NETWORKS.BITLAYER_TESTNET,
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
            id: NETWORKS.LOCALHOST,
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
    // DEPLOY SCRIPT
    [NETWORKS.LOCALHOST]: {
        BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TIMELOCK: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
        GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        CLAIMER: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
        POOL_FACTORY: "0x9A676e781A523b5d0C0e43731313A708CB607508",
        POSITION_NFT: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        COVER_NFT: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
        COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        CONTROL_BOARD: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    }
    // [NETWORKS.LOCALHOST]: {
    //     BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //     TIMELOCK: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    //     GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    //     CLAIMER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    //     POOL_FACTORY: "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d",
    //     POSITION_NFT: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
    //     COVER_NFT: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    //     COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    //     CONTROL_BOARD: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // }
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