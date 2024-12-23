// src/constants/contracts.js
const NETWORKS = {
    BITLAYER_MAINNET: 1,
    BITLAYER_TESTNET: 11155111,
    LOCALHOST: 31337
}

const CONTRACTS = {
    // [NETWORKS.BITLAYER_MAINNET]: {
    //     INSURANCE_POOL: '0x1234...5678',
    //     SURS_TOKEN: '0xabcd...efgh',
    //     BTC_TOKEN: '0x9876...5432',
    //     TIMELOCK: '0xijkl...mnop',
    //     GOVERNOR: '0xqrst...uvwx'
    // },
    // [NETWORKS.BITLAYER_TESTNET]: {
    //     INSURANCE_POOL: '0x...',
    //     SURS_TOKEN: '0x...',
    //     BTC_TOKEN: '0x...',
    //     TIMELOCK: '0x...',
    //     GOVERNOR: '0x...'
    // },
    [NETWORKS.LOCALHOST]: {
        INSURANCE_POOL: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        SURS_TOKEN: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
        BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TIMELOCK: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        GOVERNOR: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        CLAIMER: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
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

export { NETWORKS }