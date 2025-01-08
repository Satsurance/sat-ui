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
        INSURANCE_POOL: '0xb151D4A6731eF22fc5cDB117E7170E1C95896f56',
        SURS_TOKEN: '0x9DC42e84c53518258e67275e93A8bCc58Fb41d41',
        BTC_TOKEN: '0x7319f06c24FCC51a7d05f9e0A5a0eCf4F1302c7C',
        TIMELOCK: '0x1E4c8419bA7FA9A9A8c6d3E85158ff678e11d089',
        GOVERNOR: '0xdE12e5a8eb598281E5D73F6d8cEe83176B751D2C',
        CLAIMER: '0x142D07E72c92def887eEC1c7D0E2F5765475827c'
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