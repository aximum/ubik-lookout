import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { FC, ReactNode } from 'react';
import React, { useMemo } from 'react';
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import UbikCalculator from './components/UbikCalculator';

const App: FC = () => {
    return (
        <>
        <Context>
            <Content />
        </Context>
        </>
    );
};

export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    return (
        <>
            <div className='bg-video-container'>
                <video autoPlay loop muted playsInline preload='auto' className='bg-video'>
                    <source src="https://s.baa.one/videos/landscape/landscape03.mp4" type="video/mp4"></source>
                </video>
            </div>
            <UbikCalculator />
            <WalletMultiButton className='wallet-button' disabled>
                <label>Coming Soon</label>
            </WalletMultiButton>
        </>
    );
};