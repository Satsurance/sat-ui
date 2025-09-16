// src/constants/contracts.js
const NETWORKS = {
    MIDL_REGTEST: 777
}

const EPISODE_DURATION = (91 * 24 * 60 * 60) / 3; // 91 days / 3 in seconds

const SUPPORTED_NETWORKS =
{
    [NETWORKS.MIDL_REGTEST]: {
        id: NETWORKS.MIDL_REGTEST,
        name: 'MIDL Regtest',
        rpcUrls: ['https://rpc.regtest.midl.xyz'],
        nativeCurrency: {
            name: 'BTC',
            symbol: 'BTC',
            decimals: 18,
        },
        blockExplorerUrls: ['https://mempool.regtest.midl.xyz'],
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
    // [NETWORKS.LOCALHOST]: {
    //     BTC_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //     TIMELOCK: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    //     GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    //     CLAIMER: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
    //     POOL_FACTORY: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    //     POSITION_NFT: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    //     COVER_NFT: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    //     COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    //     CONTROL_BOARD: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // }
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
    [NETWORKS.MIDL_REGTEST]: {
        BTC_TOKEN: "0xC726845d8b6f0586A12D31ec5075e47B28c8eC4A",
        TIMELOCK: "0xF9EA1C8f74a505701DdB3403e5B4147bc00b4C8D",
        GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        CLAIMER: "0x8DdC82E7124913b0bbE824B10DDC93F2653d356E",
        POOL_FACTORY: "0x22b01Ff445fb6A8ecB217B06E84b2c51058b30D4",
        POSITION_NFT: "0x2Ae43f91Cf03C4B6919F591B84c44617C1A13861",
        COVER_NFT: "0xf37dE0d8F752b404FDE85cC446220d6F42C8edfe",
        COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        CONTROL_BOARD: "0xaFb984E56A53EB4497dCE88874363337Bf99E668"
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