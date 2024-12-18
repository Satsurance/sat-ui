import { createRouter, createWebHistory } from 'vue-router';
import { useWeb3Store } from '../stores/web3Store';

const routes = [
    {
        path: '/',
        component() {location.href = 'https://www.satsurance.xyz/'}
    },
    {
        path: '/stake',
        component: () => import('../layouts/StakingLayout.vue'),
    },
    {
        path: '/claim',
        component: () => import('../layouts/ClaimLayout.vue'),
    },
    {
        path: '/cover',
        component: () => import('../layouts/CoverLayout.vue'),
    },
    {
        path: '/claims_gov',
        component: () => import('../layouts/ClaimGovLayout.vue'),
    },
    {
        path: '/docs',
        component() {location.href = 'https://satsurance.gitbook.io/satsurance'}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guard for wallet-required routes
router.beforeEach((to, from, next) => {
    const web3Store = useWeb3Store();

    if (to.meta.requiresWallet && !web3Store.isConnected) {
        next({ name: 'home' });
    } else {
        next();
    }
});

export default router;