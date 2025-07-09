// src/constants/pools.js
import { NETWORKS } from './contracts.js';

const POOL_NAMES = {
    [NETWORKS.BOB_TESTNET]: {
        1: "Main Insurance Pool",
        2: "Secondary Pool",
        3: "High-Yield Pool"
    },
    [NETWORKS.INK_TESTNET]: {
        1: "Primary Pool",
        2: "Balanced Pool",
        3: "Growth Pool"
    },
    [NETWORKS.BITLAYER_TESTNET]: {
        1: "Core Pool",
        2: "Stable Pool",
        3: "Advanced Pool"
    },
    [NETWORKS.LOCALHOST]: {
        1: "Test Pool",
    }
};

/**
 * Get pool name with fallback to default format
 * @param {number} chainId - The chain ID
 * @param {number} poolId - The pool ID
 * @returns {string} Pool name or default format
 */
export const getPoolName = (chainId, poolId) => {
    const chainPools = POOL_NAMES[chainId];
    if (chainPools && chainPools[poolId]) {
        return chainPools[poolId];
    }
    return `Pool #${poolId}`;
};

export { POOL_NAMES }; 