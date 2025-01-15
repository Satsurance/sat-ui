import babylonLogo from '/src/assets/logos/babylon.svg'
import bitflowLogo from '/src/assets/logos/bitflow.svg'
import bitlayerLogo from '/src/assets/logos/bitlayer.png'
import satlayerLogo from '/src/assets/logos/satlayer.svg'
import liquidiumLogo from '/src/assets/logos/liquidium.svg'
import allbridgeLogo from '/src/assets/logos/allbridge.svg'
import lorenzoLogo from '/src/assets/logos/lorenzo.svg'
import dotswapLogo from '/src/assets/logos/dotswap.png'

export const COVER_PROJECTS = {
    'Babylon': {
        logo: babylonLogo,
        category: 'Slashing',
        description: 'Bitcoin staking protocol',
        minCover: 0.0001,
        maxCover: 100,
        rate: 2.5
    },
    'Bitflow': {
        logo: bitflowLogo,
        category: 'Defi',
        description: 'All-in-one DeFi on Stacks',
        minCover: 0.00001,
        maxCover: 50,
        rate: 3.0
    },
    'Bitlayer Bridge': {
        logo: bitlayerLogo,
        category: 'Bridges',
        description: 'L2 bitcoin Bridge',
        minCover: 0.00001,
        maxCover: 20,
        rate: 5.0
    },
    'Satlayer': {
        logo: satlayerLogo,
        category: 'Slashing',
        description: 'Bitcoin restaking protocol',
        minCover: 0.00001,
        maxCover: 30,
        rate: 2.8
    },
    'Liquidium': {
        logo: liquidiumLogo,
        category: 'Defi',
        description: 'Oridinals loan platform',
        minCover: 0.00001,
        maxCover: 40,
        rate: 3.2
    },
    'Allbridge': {
        logo: allbridgeLogo,
        category: 'Bridges',
        description: 'Cross-chain bridge',
        minCover: 0.00001,
        maxCover: 25,
        rate: 4.5
    },
    'Lorenzo': {
        logo: lorenzoLogo,
        category: 'Slashing',
        description: 'Bitcoin yield protocol',
        minCover: 0.00001,
        maxCover: 15,
        rate: 2.6
    },
    'DotSwap': {
        logo: dotswapLogo,
        category: 'Defi',
        description: 'Bitcoin native AMM',
        minCover: 0.00001,
        maxCover: 35,
        rate: 3.5
    }
};