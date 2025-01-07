// src/constants/contracts.js
const NETWORKS = {
    BITLAYER_MAINNET: 200901,
    BITLAYER_TESTNET: 200810,
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
    [NETWORKS.BITLAYER_TESTNET]: {
        INSURANCE_POOL: '0x8b673Aef416459732395917528BA8CC932Ee33d3',
        SURS_TOKEN: '0x2CD9C074D26dA21f1719Df05449d5D3010bfc877',
        BTC_TOKEN: '0xFa5142fcd86460a17b497AD9668f09eE55782D50',
        TIMELOCK: '0x5e0c5f0286deB69eB7BC529CE7D135cbF7b31862',
        GOVERNOR: '0x2E459B47A27a3BdDDEE90C627c10e13bd3BDb38f',
        CLAIMER: '0x37e12e1c208446743027dC3098078505407aA59a'
    },
    [NETWORKS.LOCALHOST]: {
        INSURANCE_POOL: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        SURS_TOKEN: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TIMELOCK: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        GOVERNOR: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        CLAIMER: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
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