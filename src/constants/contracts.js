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
        INSURANCE_POOL: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
        SURS_TOKEN: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        BTC_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        TIMELOCK: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        GOVERNOR: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
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