import * as PIXI from 'pixi.js'
import "reflect-metadata";

// Setup application
const app = new PIXI.Application({
    width: window.screen.width*.42, height:window.screen.height*.8, backgroundColor: 0xdddddd, resolution: window.devicePixelRatio || 1, transparent: true
});

document.body.appendChild(app.view);

// Load Textures
let loader = PIXI.Loader.shared;
loader.onComplete.add(onLoadComplete);
loader.baseUrl = "assets/"
loader
    .add("images/apple.png")
    .add("images/snake.png")
    .add("images/tile.png")
    .add("sounds/eat.mp3");
loader.load();

let mainContainer: PIXI.Container = new PIXI.Container();

let tileContainer: PIXI.Container = new PIXI.Container();
let gameContainer: PIXI.Container = new PIXI.Container();
let UIContainer: PIXI.Container = new PIXI.Container();
let popupContainer: PIXI.Container = new PIXI.Container();

// UI settings and variables
const scoreLabel: PIXI.Text = new PIXI.Text("Score:");
scoreLabel.x = 10;
scoreLabel.y = 10;
const scoreCount: PIXI.Text = new PIXI.Text("0");
scoreCount.x = scoreLabel.width + 15;
scoreCount.y = 10;

let uiHeight = 20 + scoreCount.height;

const UIGraphics = new PIXI.Graphics();
UIGraphics.lineStyle(2, 0x76990f, 1);
UIGraphics.beginFill(0x8eb812, 1);
UIGraphics.drawRoundedRect(2, 2, app.view.width-4, uiHeight-4, 10);
UIGraphics.endFill();

UIContainer.addChild(UIGraphics);
UIContainer.addChild(scoreLabel);
UIContainer.addChild(scoreCount);
mainContainer.addChild(UIContainer);

tileContainer.y = scoreCount.height + 25;

// Popup container
const popupGraphics = new PIXI.Graphics();
popupGraphics.lineStyle(2, 0x333333, 1);
popupGraphics.beginFill(0x888888, 0.75);
popupGraphics.drawRoundedRect(0, 0, app.view.width / 2, app.view.height / 2, 10);
popupGraphics.endFill();
popupContainer.addChild(popupGraphics);

// Game over text and score
let gameOverText = new PIXI.Text("Game over!");
gameOverText.anchor.set(0.5,0);
gameOverText.x = popupContainer.width / 2;
gameOverText.y = 20;
popupContainer.addChild(gameOverText);
let gameOverScoreLabel = new PIXI.Text("Your Final score was:");
gameOverScoreLabel.anchor.set(0.5,0);
gameOverScoreLabel.x = popupContainer.width / 2;
gameOverScoreLabel.y = popupContainer.height / 3;
popupContainer.addChild(gameOverScoreLabel);
let gameOverScoreCount = new PIXI.Text("-1");
gameOverScoreCount.anchor.set(0.5,0);
gameOverScoreCount.x = popupContainer.width / 2;
gameOverScoreCount.y = popupContainer.height / 3 + gameOverScoreLabel.height + 20;
popupContainer.addChild(gameOverScoreCount);

// Play Again button
let popupButton = new PIXI.Container();
popupButton.interactive = true;
popupButton.buttonMode = true;
popupButton.pivot.set(0.5,0);
popupButton.x = popupContainer.width / 2;
popupButton.y = popupContainer.height - popupButton.height - 30;

let playAgainText = new PIXI.Text("Play Again");
playAgainText.anchor.set(0.5);
// popupButton.width = popupContainer.width;
popupButton.addChild(playAgainText);
popupContainer.addChild(popupButton);

// set popup position and pivot
popupContainer.pivot.x = popupContainer.width /2;
popupContainer.pivot.y = popupContainer.height /2;
popupContainer.x = app.view.width /2;
popupContainer.y = app.view.height /2;
popupContainer.visible = false;

// Game Settings and variables
const gameFieldSize = 20;
const gameTileSize = 40;
let gameManager: GameManager;
let player: Player;
let playerStartSize: number = 5;
let playerStartX: number = 7;
let playerStartY: number = 9;
let playerSheet: PlayerSheet;
let consumable: Consumable;
let moveTimer: number = 0;
let moveSpeed: number = 15;

// Game Initialization
function onLoadComplete() {
    // Create gameManager
    gameManager = new GameManager();

    let tileTex: PIXI.Texture = PIXI.Texture.from(loader.resources["images/tile.png"].url);
    // let tileSprite = new PIXI.TilingSprite(tileTex, gameFieldSize * tileTex.width,gameFieldSize * tileTex.height)
    // tileContainer.addChild(tileSprite);
    // Create game field tiles
    for (let i = 0; i < gameFieldSize* gameFieldSize; i++)
    {
        let tile = new PIXI.Sprite(tileTex);
        // Tint game field chess board style
        if (i % 2 + Math.floor(i / gameFieldSize % 2) == 1)
            tile.tint = 0x8eb812;
        else tile.tint = 0xa6d715;
        
        tile.anchor.set(0.5);
        tile.name = "Tile" + i;
        tile.x = i % gameFieldSize * gameTileSize + gameTileSize / 2;
        tile.y = Math.floor(i / gameFieldSize) * gameTileSize + gameTileSize / 2;

        tileContainer.addChild(tile)
    }
    tileContainer.x = (mainContainer.width - tileContainer.width) / 2;

    let playerBaseTex: PIXI.BaseTexture = PIXI.BaseTexture.from(loader.resources["images/snake.png"].url);
    playerSheet = {
        heads: [
            new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(0, 0, 42, 42)),
            new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(0, 42, 42, 42)),
            new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(0, 84, 42, 42)),
        ],
        straight: new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(84, 84, 42, 42)),
        tail: new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(42, 84, 42, 42)),
        bend: new PIXI.Texture(playerBaseTex, new PIXI.Rectangle(42, 0, 42, 42))
    }
    player = new Player();

    // Create consumable
    let appleTex = PIXI.Texture.from(loader.resources["images/apple.png"].url)
    consumable = new Consumable(0, 0, appleTex);
    gameManager.SpawnConsumable();

    // register listener for keydown events
    window.addEventListener("keydown", HandleInput);
    popupButton.addListener("click", ClickPlayAgain);

    // Add player to gameContainer
    gameContainer.addChild(player);
    gameContainer.addChild(consumable);
    tileContainer.addChild(gameContainer);
    
    mainContainer.addChild(tileContainer);
    mainContainer.addChild(popupContainer);
    app.stage.addChild(mainContainer)
    
    // app.stage.updateTransform();
    // Add game loop to render loop
    app.ticker.add(GameLoop);
}

// Handle Keydown events
function HandleInput(event: KeyboardEvent) {
    if (popupContainer.visible) return;
    player.HandleInput(event);
}

function ClickPlayAgain(){
    gameManager.ResetGame();
}

function ClampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

// Game Loop
function GameLoop(delta: number) {
    moveTimer += delta;
    if (moveTimer >= moveSpeed) {
        moveTimer = 0;
        player.Update();
        if (player.CheckForConsumable(consumable))
            gameManager.SpawnConsumable();
    }
}

interface PlayerSheet {
    heads: PIXI.Texture[];
    straight: PIXI.Texture;
    tail: PIXI.Texture;
    bend: PIXI.Texture;
}

// Player Class
class Player extends PIXI.AnimatedSprite {
    movingX: number = 1;
    movingY: number = 0;
    lastMovingX: number = 1;
    lastMovingY: number = 0;
    xPos: number;
    yPos: number;
    headAnimationFrame: number = 0;
    playerSheet: PlayerSheet;
    bodySegments: BodySegment[] = [];
    occupiedPositions: number[] = [];
    grow: boolean = false;

    constructor(playerSpriteSheet: PlayerSheet = playerSheet, xPos: number = playerStartX, yPos: number = playerStartY, name: string = "Player") {
        super(playerSpriteSheet.heads);
        this.anchor.set(0.5);
        this.animationSpeed = .1;
        this.loop = true;
        this.playerSheet = playerSpriteSheet;
        this.name = name;

        // clamp xPos between 0 and GameFieldSize - 1
        this.xPos = ClampValue(xPos, 0, gameFieldSize - 1);
        this.yPos = ClampValue(yPos, 0, gameFieldSize - 1);

        // set position and rotation of player
        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
        this.rotation = -Math.PI / 2;

        // Spawn initial body segments
        for (let i = playerStartSize; i > 0; i--)
            this.AddBodySegment(this.xPos - i);

        this.UpdateBodySegments();

        this.play();
    }

    Update() {
        if (!gameManager.isPlaying) return;
        this.MovePlayer();
        this.RotateHead();
        this.UpdateBodySegments();
        if (this.CheckForDeath()) gameManager.GameOver();
    }

    HandleInput(event: KeyboardEvent) {
        gameManager.isPlaying = true;
        if (event.type == "keydown") {
            if (event.key == "w") {
                this.movingY = -1;
                this.movingX = 0;
            }
            if (event.key == "s") {
                this.movingY = 1;
                this.movingX = 0;
            }
            if (event.key == "a") {
                this.movingX = -1;
                this.movingY = 0;
            }
            if (event.key == "d") {
                this.movingX = 1;
                this.movingY = 0;
            }
        }
    }

    MovePlayer() {
        this.MoveBodySegments();
        this.MoveHead();
    }

    MoveHead() {
        // Only change direction if it is not opposite of the last move
        if (this.movingX != 0 && this.lastMovingX == 0 || this.movingY != 0 && this.lastMovingY == 0) {
            this.xPos += this.movingX;
            this.yPos += this.movingY;
            this.lastMovingX = this.movingX;
            this.lastMovingY = this.movingY;
        } else {
            this.xPos += this.lastMovingX;
            this.yPos += this.lastMovingY;
        }

        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
    }

    MoveBodySegments() {
        // Add new body segment
        if (this.grow) {
            this.AddBodySegment();
            this.grow = false;
        }
        // Move segments to the position of the next segment of the body
        else {
            for (let i = this.bodySegments.length - 1; i > -1; i--) {
                let segment = this.bodySegments[i];
                
                if (i == 0) {
                    segment.xPos = this.xPos;
                    segment.yPos = this.yPos;
                } else {
                    segment.xPos = this.bodySegments[i - 1].xPos;
                    segment.yPos = this.bodySegments[i - 1].yPos;
                }

                segment.Move();
            }
        }
    }

    PlayerIsMoving(): boolean {
        return this.movingX != 0 || this.movingY != 0;
    }

    AddBodySegment(xPos: number = this.xPos, yPos: number = this.yPos, texture: PIXI.Texture = this.playerSheet.straight) {
        let segment = new BodySegment(xPos, yPos, texture);
        segment.name = "bodySegment" + this.bodySegments.length;
        this.bodySegments.unshift(segment);
        gameContainer.addChild(segment);
    }

    RotateHead() {
        if (this.lastMovingX != 0)
            this.rotation = Math.PI / 2 * -this.lastMovingX;
        else if (this.lastMovingY == -1)
            this.rotation = Math.PI;
        else if (this.lastMovingY == 1)
            this.rotation = 0;
    }

    UpdateBodySegments() {
        for (let i = this.bodySegments.length - 1; i > -1; i--) {
            let segment = this.bodySegments[i];
            // Get positions of previous and next segment
            let nextXPos = i == 0 ? this.xPos - segment.xPos : this.bodySegments[i - 1].xPos - segment.xPos;
            let nextYPos = i == 0 ? this.yPos - segment.yPos : this.bodySegments[i - 1].yPos - segment.yPos;
            let previousXPos = i == this.bodySegments.length - 1 ? 0 : this.bodySegments[i + 1].xPos - segment.xPos;
            let previousYPos = i == this.bodySegments.length - 1 ? 0 : this.bodySegments[i + 1].yPos - segment.yPos;

            // Rotate tail
            if (i == this.bodySegments.length - 1) {
                segment.texture = this.playerSheet.tail;
                if (nextXPos != 0) {
                    segment.rotation = Math.PI / 2 * nextXPos;
                } else segment.rotation = nextYPos == 1 ? Math.PI : 0;
            }
            // Standard body Segments
            else {
                // Straight up-down
                if (previousXPos == 0 && nextXPos == 0) {
                    segment.texture = this.playerSheet.straight;
                    segment.rotation = 0;
                }
                // Straight left-right
                else if (previousYPos == 0 && nextYPos == 0) {
                    segment.texture = this.playerSheet.straight;
                    segment.rotation = Math.PI / 2;
                }
                // Bend left-bottom
                else if (previousXPos < 0 && nextYPos > 0 || nextXPos < 0 && previousYPos > 0) {
                    segment.texture = this.playerSheet.bend;
                    segment.rotation = Math.PI / 2;
                }
                // Bend left-up
                else if (previousXPos < 0 && nextYPos < 0 || nextXPos < 0 && previousYPos < 0) {
                    segment.texture = this.playerSheet.bend;
                    segment.rotation = Math.PI;
                }
                // Bend right-bottom
                else if (previousXPos > 0 && nextYPos > 0 || nextXPos > 0 && previousYPos > 0) {
                    segment.texture = this.playerSheet.bend;
                    segment.rotation = 0;
                }
                // Bend right-up
                else if (previousXPos > 0 && nextYPos < 0 || nextXPos > 0 && previousYPos < 0) {
                    segment.texture = this.playerSheet.bend;
                    segment.rotation = -Math.PI / 2;
                }
            }
        }
    }

    CheckForConsumable(consumable: Consumable): boolean {
        if (this.xPos == consumable.xPos && this.yPos == consumable.yPos) {
            this.grow = true;
            gameManager.score++;
            scoreCount.text = gameManager.score.toString();
            return true;
        } else return false;
    }

    Reset() {
        // Set x and y pos to starting values
        this.xPos = ClampValue(playerStartX, 0, gameFieldSize - 1);
        this.yPos = ClampValue(playerStartY, 0, gameFieldSize - 1);

        // Set position and rotation of player
        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
        this.rotation = -Math.PI / 2;

        // Set movingX and movingY
        this.movingX = 1;
        this.movingY = 0;
        this.lastMovingX = 1;
        this.lastMovingY = 0;

        // Clear body segments
        this.bodySegments = [];

        // Spawn initial body segments
        for (let i = playerStartSize; i > 0; i--)
            this.AddBodySegment(this.xPos - i);

        this.UpdateBodySegments();
    }

    CheckForDeath(): boolean {
        if (this.xPos >= gameFieldSize || this.yPos >= gameFieldSize || this.xPos < 0 || this.yPos < 0) return true;

        let currentPos = this.xPos + this.yPos * gameFieldSize;
        this.occupiedPositions = [];
        this.bodySegments.forEach((value)=> this.occupiedPositions.push(value.xPos + value.yPos * gameFieldSize));
        
        return this.occupiedPositions.indexOf(currentPos) > 0;
    }
}

class BodySegment extends PIXI.Sprite {
    xPos: number;
    yPos: number;

    constructor(xPos: number, yPos: number, texture: PIXI.Texture) {
        super(texture);
        this.xPos = ClampValue(xPos, 0, gameFieldSize - 1);
        this.yPos = ClampValue(yPos, 0, gameFieldSize - 1);
        this.anchor.set(0.5);
        this.Move();
    }

    Move() {
        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
    }
}

class Consumable extends PIXI.Sprite {
    xPos: number;
    yPos: number;

    constructor(xPos: number, yPos: number, texture: PIXI.Texture) {
        super(texture);
        this.xPos = ClampValue(xPos, 0, gameFieldSize - 1);
        this.yPos = ClampValue(yPos, 0, gameFieldSize - 1);
        this.anchor.set(0.5);
        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
    }

    Spawn() {
        this.x = this.xPos * gameTileSize + this.width / 2;
        this.y = this.yPos * gameTileSize + this.height / 2;
    }
}

class GameManager {
    allPositions: number[] = [];
    isPlaying: boolean = false;
    score: number = 0;

    constructor() {
        for (let i = 0; i < gameFieldSize * gameFieldSize; i++)
            this.allPositions.push(i);
    }

    SpawnConsumable() {
        // Get random number between 0 and the amount of available positions
        let pos: number = Math.floor(Math.random() * (this.allPositions.length - player.bodySegments.length));
        // All positions not occupied by a body segment or the player head
        let possiblePositions: number[] = this.allPositions.filter((value)=> 
            player.occupiedPositions.indexOf(value) == -1 && value != player.xPos + player.yPos * gameFieldSize);
        
        // Get position number, dont allow spawn on player head since it does count as an available pos
        pos = possiblePositions[pos];
        // Calculate xPos
        consumable.xPos = pos % gameFieldSize;
        // Calculate yPos
        consumable.yPos = Math.floor(pos / gameFieldSize);

        consumable.Spawn();
    }

    ResetGame() {
        this.score = 0;
        scoreCount.text = "0";
        // Clear stage
        gameContainer.removeChildren();
        // Initialize new player
        player.Reset();
        // Reset Consumable
        this.SpawnConsumable();
        // Add player and consumable to stage
        gameContainer.addChild(player);
        gameContainer.addChild(consumable);
        popupContainer.visible = false;
    }

    GameOver() {
        this.isPlaying = false;
        gameOverScoreCount.text = this.score.toString();
        popupContainer.visible = true;
    }
}