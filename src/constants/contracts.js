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
        TIMELOCK: "0xF4A2B23C23a489Bd914DBf30287f01Dd84299EED",
        GOVERNOR: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        CLAIMER: "0xfBE867458aD202287576dd5E6e7503fB23729bAB",
        POOL_FACTORY: "0x130accf3566E7813788f78EB8BfBD7f6F3538EC8",
        POSITION_NFT: "0xaf91f709FbBa3e70E6acdF4Bad336d6F42B80591",
        COVER_NFT: "0x8f58E21BB786064621c277b1CD4bE4e48C6dA864",
        COVER_PURCHASER: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        CONTROL_BOARD: "0x7735FcCe72831F2c03991cff7feC1780637FceF3",
        
    },
    
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