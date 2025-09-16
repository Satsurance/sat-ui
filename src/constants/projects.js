import babylonLogo from '/src/assets/logos/babylon.svg'
import bitflowLogo from '/src/assets/logos/bitflow.svg'
import bitlayerLogo from '/src/assets/logos/bitlayer.png'
import satlayerLogo from '/src/assets/logos/satlayer.svg'
import liquidiumLogo from '/src/assets/logos/liquidium.svg'
import allbridgeLogo from '/src/assets/logos/allbridge.svg'
import lorenzoLogo from '/src/assets/logos/lorenzo.svg'
import dotswapLogo from '/src/assets/logos/dotswap.png'

export const COVER_PRODUCTS = {
    1: { // Pool 1 - Bitcoin DeFi Products
        0: {
            name: 'Babylon',
            logo: babylonLogo,
            category: 'Web3'
        },
        1: {
            name: 'Bitflow',
            logo: bitflowLogo,
            category: 'Web3'
        },
        2: {
            name: 'Satlayer',
            logo: satlayerLogo,
            category: 'Web3'
        },
        3: {
            name: 'Lorenzo',
            logo: lorenzoLogo,
            category: 'Web3'
        }
    },
    2: { // Pool 2 - Bridge Products
        0: {
            name: 'Bitlayer Bridge',
            logo: bitlayerLogo,
            category: 'Web3'
        },
        1: {
            name: 'Allbridge',
            logo: allbridgeLogo,
            category: 'Web3'
        }
    },
    3: { // Pool 3 - Trading & AMM Products
        0: {
            name: 'Liquidium',
            logo: liquidiumLogo,
            category: 'Web3'
        },
        1: {
            name: 'DotSwap',
            logo: dotswapLogo,
            category: 'Web3'
        },
        2: {
            name: 'Lorenzo',
            logo: lorenzoLogo,
            category: 'Web3'
        }
    }
};