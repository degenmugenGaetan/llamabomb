import { SCREEN_HEIGHT, SCREEN_WIDTH, GameScene } from './constants/game.js';
import { Game } from './engine/Game.js';
import { DisclaimerScene, TitleScene, SinglePlayerScene } from './scenes/index.js';
export class BombermanGame extends Game {
    afterGame = null;
    constructor() {
        super(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.changeScene(GameScene.DISCLAIMER);
    }
    endGame(score) {
        console.log(`in bomberman endGame`);
        if (this.afterGame) {
            this.afterGame(score);
        }
    }
    getScene(newScene) {
        switch (newScene) {
            case GameScene.DISCLAIMER:
                return DisclaimerScene;
            case GameScene.TITLE:
                return TitleScene;
            case GameScene.SINGLE_PLAYER:
                return SinglePlayerScene;
            default:
                throw new TypeError(`Unknown game scene ${newScene}`);
        }
    }
    changeScene = (newScene, difficulty) => {
        const SceneClass = this.getScene(newScene);
        this.scene?.cleanUp();
        if (SceneClass === SinglePlayerScene && difficulty) {
            this.scene = new SceneClass(this.frameTime, this.changeScene, difficulty);
        }
        else if (SceneClass === SinglePlayerScene) {
            throw new Error("Difficulty must be provided for SinglePlayerScene");
        }
        else {
            this.scene = new SceneClass(this.frameTime, this.changeScene, difficulty);
        }
    };
}
//# sourceMappingURL=BombermanGame.js.map