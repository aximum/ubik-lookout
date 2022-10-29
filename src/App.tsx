import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useState, useEffect } from 'react';


import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import UbikCalculator from './components/UbikCalculator';
import getUbiks from './components/getUbiks';

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
    const network = WalletAdapterNetwork.Mainnet;

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

    const [ubiks, setUbiks] = useState<number[]>([]);

    const { publicKey } = useWallet();

    useEffect(() => {
        if (publicKey !== null) {
            updateUbiks()
        }
    },[publicKey])

    const updateUbiks = async () => {

        const ubiks1 = await getUbiks(publicKey);
        setUbiks(ubiks1);
    };

    const UbikCalculatorContext = React.createContext(ubiks)
    
    return (
        <>
            <div className='bg-video-container'>
                <video autoPlay loop muted playsInline preload='auto' className='bg-video'>
                    <source src="https://s.baa.one/videos/landscape/landscape03.mp4" type="video/mp4"></source>
                </video>
            </div>
            <UbikCalculatorContext.Provider value={ubiks}>
                <UbikCalculator ubiks={ubiks}/>
            </UbikCalculatorContext.Provider>
            <WalletMultiButton className='wallet-button'></WalletMultiButton>
        </>
    );
};