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
        INSURANCE_POOL: '0x6F0ed23026e2D606079c838D6d30b1E936F51787',
        SURS_TOKEN: '0xF77757063afd7d8976A13A359EeDB2428c14A248',
        BTC_TOKEN: '0xf2e60aD832447323B0E28dBD4581079bF06f6404',
        TIMELOCK: '0x75916B9b986Fdc37b4d8A9eeE346b54E30CF947C',
        GOVERNOR: '0x43c9fF875AB1e8ca867859DDbba28D962DeE99E0',
        CLAIMER: '0x53243C478285779406C6f9F2FE02696b83471f8e',
        COVER_PURCHASER: '0x1397930814E12d98bbFFf4dD21a1F702356C56ac',
    },
    [NETWORKS.LOCALHOST]: {
        INSURANCE_POOL: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        SURS_TOKEN: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        TIMELOCK: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        GOVERNOR: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        CLAIMER: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
        COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
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