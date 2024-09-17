import { BombermanGame } from './BombermanGame.js';
import { connectWallet, sendScore } from './ao.js';

declare global {
    var walletAddress: string | null;
}

class GameManager {
	private game: BombermanGame | null = null;
	private connectBtn: HTMLButtonElement;
	private walletStatus: HTMLSpanElement;
	private scoreSection: HTMLElement;
	private scoreDisplay: HTMLSpanElement;
	private sendScoreBtn: HTMLButtonElement;
	private navbar: HTMLElement;

    constructor() {
			this.connectBtn = document.querySelector('#walletSection button') as HTMLButtonElement;
			this.walletStatus = document.getElementById('walletStatus') as HTMLSpanElement;
			this.scoreSection = document.getElementById('scoreSection') as HTMLElement;
			this.scoreDisplay = document.querySelector('#scoreSection span') as HTMLSpanElement;
			this.sendScoreBtn = document.querySelector('#scoreSection button') as HTMLButtonElement;
			this.navbar = document.getElementById('navbar') as HTMLElement;

			this.initializeEventListeners();
			this.updateNavbar();
    }

    private initializeEventListeners() {
        this.connectBtn.addEventListener('click', this.handleConnect.bind(this));
        this.sendScoreBtn.addEventListener('click', this.handleSendScore.bind(this));
				window.addEventListener('scoreSubmitted', this.handleScoreSubmitted.bind(this) as EventListener);
    }

		private handleScoreSubmitted(event: CustomEvent) {
			const score = event.detail.score;
			this.displayNavbarMessage(`Score ${score} submitted successfully!`, 5000);
	}

	private displayNavbarMessage(message: string, duration: number) {
		const messageElement = document.createElement('div');
		messageElement.textContent = message;
		messageElement.style.cssText = `
				position: absolute;
				top: 100%;
				left: 0;
				right: 0;
				background-color: #4CAF50;
				color: black;
				text-align: center;
				padding: 10px;
				transition: top 0.5s ease-in-out;
		`;
		this.navbar.appendChild(messageElement);

		// Show the message
		setTimeout(() => {
				messageElement.style.top = '0';
		}, 100);

		// Hide and remove the message after the specified duration
		setTimeout(() => {
				messageElement.style.top = '100%';
				setTimeout(() => {
						this.navbar.removeChild(messageElement);
				}, 500);
		}, duration);
}

    private async handleConnect() {
        try {
            await connectWallet();
            this.updateNavbar();
            this.startGame();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet: ' + (error as Error).message);
        }
    }

    private async handleSendScore() {
        const score = this.scoreDisplay.textContent;
        if (score) {
            try {
                await sendScore(score);
                this.showTemporaryMessage(`Score ${score} submitted successfully!`);
            } catch (error) {
                console.error('Failed to send score:', error);
                alert('Failed to send score: ' + (error as Error).message);
            }
        }
    }

    private updateNavbar() {
        if (globalThis.walletAddress) {
            this.walletStatus.textContent = `Connected: ${globalThis.walletAddress}`;
            this.connectBtn.style.display = 'none';
        } else {
            this.walletStatus.textContent = 'Not connected';
            this.connectBtn.style.display = 'inline-block';
        }
        this.scoreSection.style.display = 'none';
    }

    private startGame() {
        if (globalThis.walletAddress) {
            this.game = new BombermanGame();
            this.game.afterGame = this.handleGameEnd.bind(this);
            this.game.start();
        } else {
            alert('Please connect your wallet to start a new game.');
        }
    }

    private async handleGameEnd(score: number) {
        this.scoreDisplay.textContent = `${score}`;
        this.scoreSection.style.display = 'block';
        this.updateNavbar();

        try {
            await sendScore(score.toString());
            this.showTemporaryMessage(`Score ${score} submitted successfully!`);
        } catch (error) {
            console.error('Failed to send score:', error);
            this.showTemporaryMessage(`Failed to submit score: ${(error as Error).message}`);
        }
    }

    private showTemporaryMessage(message: string, duration: number = 5000) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 1001;
        `;

        this.navbar.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, duration);
    }
}

window.addEventListener('load', () => {
    new GameManager();
});
