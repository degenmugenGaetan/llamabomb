// Import the library from CDN
import { createDataItemSigner, message, result } from '@permaweb/aoconnect';

export async function connectWallet() {
    if (window.arweaveWallet) {
        try {
            await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
            globalThis.walletAddress = await window.arweaveWallet.getActiveAddress();
            return globalThis.walletAddress;
        } catch (error) {
            console.error('Failed to connect to wallet:', error);
            throw error;
        }
    } else {
        throw new Error('ArConnect wallet not detected');
    }
}

export async function sendScore(score) {
    if (!globalThis.walletAddress) {
        throw new Error('Wallet not connected');
    }

    const signer = createDataItemSigner(window.arweaveWallet);
    const messageId = await message({
        process: 'q6q0mjZ2UYUpdDYmxemVTyjKf6176F2Sse3N7uAW3D0',
        signer: signer,
        tags: [
            { name: 'Action', value: 'SetScore' }
        ],
        data: score.toString(),
    });

    return messageId;
}

export async function sendMessageSave(data) {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
        throw new Error('Wallet not connected');
    }

    const signer = createDataItemSigner(window.arweaveWallet);
    const messageId = await message({
        process: 'q6q0mjZ2UYUpdDYmxemVTyjKf6176F2Sse3N7uAW3D0',
        signer: signer,
        tags: [
            { name: 'Action', value: 'SetMessages' }
        ],
        data: data,
    });

    return messageId;
}

export async function sendMessageLoad() {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
        throw new Error('Wallet not connected');
    }

    const signer = createDataItemSigner(window.arweaveWallet);

    try {
        const messageId = await message({
            process: 'q6q0mjZ2UYUpdDYmxemVTyjKf6176F2Sse3N7uAW3D0',
            signer: signer,
            tags: [
                { name: 'Action', value: 'GetMessages' }
            ],
        });
        const { Messages, Error } = await result({
            message: messageId,
            process: 'q6q0mjZ2UYUpdDYmxemVTyjKf6176F2Sse3N7uAW3D0',
        });
        if (Error) {
            alert("There was an error loading data:" + Error);
            return;
        }
        if (!Messages || Messages.length === 0) {
            alert('Message empty !');
        }
        return Messages;
    } catch (error) {
        alert('There was an error during loading data: ' + error);
    }
}
