import { createRouter, createWebHistory } from 'vue-router';
import { useWeb3Store } from '../stores/web3Store';

const routes = [
    {
        path: '/about',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            // {
            //     path: '',
            //     name: 'home',
            //     component: () => import('../pages/Home.vue')
            // },
            // {
            //     path: 'swap',
            //     name: 'swap',
            //     component: () => import('../pages/Swap.vue'),
            //     meta: { requiresWallet: true }
            // },
            // {
            //     path: 'portfolio',
            //     name: 'portfolio',
            //     component: () => import('../pages/Portfolio.vue'),
            //     meta: { requiresWallet: true }
            // }
        ]
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