import { computed } from 'vue';
import { useWeb3Store } from '../stores/web3Store';

export function useWeb3() {
    const web3Store = useWeb3Store();

    const checkMetaMaskInstalled = () => {
        return typeof window.ethereum !== 'undefined';
    };

    const connectWallet = async () => {
        if (!checkMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed');
        }
        return web3Store.connectWallet();
    };

    return {
        connectWallet,
        checkMetaMaskInstalled,
        isConnected: computed(() => web3Store.isConnected),
        account: computed(() => web3Store.account),
        chainId: computed(() => web3Store.chainId)
    };
}