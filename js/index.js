// const Phaser = require("phaser");

window.addEventListener("load", () => {
  const game = new Phaser.Game({
    width: 544,
    height: 304,
    type: Phaser.AUTO,
    backgroundColor: "#FFFFFF",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: {
          y: 500,
        },
      },
    },
    render: {
      pixelArt: true,
    },
    input: {
      activePointers: 1,
    },
  });

  game.scene.add("Boot", Boot, true);
  game.scene.add("Preloader", Preloader);
  game.scene.add("Level", Level);
});

class Boot extends Phaser.Scene {
  preload() {
    this.scene.launch("Preloader");

    this.load.spritesheet("player/idle", "assets/sprites/Idle-Sheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("player/run", "assets/sprites/Run-Sheet.png", {
      frameWidth: 80,
      frameHeight: 64,
    });
    this.load.spritesheet("player/jump", "assets/sprites/Jump-All-Sheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet(
      "player/light-attack",
      "assets/sprites/Attack-01-Sheet.png",
      {
        frameWidth: 96,
        frameHeight: 64,
      }
    );
    this.load.spritesheet("boar/idle", "assets/sprites/Boar-Idle-Sheet.png", {
      frameWidth: 196 / 4,
      frameHeight: 32,
    });
    this.load.spritesheet("boar/walk", "assets/sprites/Boar-Walk-Sheet.png", {
      frameWidth: 288 / 6,
      frameHeight: 32,
    });
    this.load.spritesheet("boar/hit", "assets/sprites/Boar-Hit-Sheet.png", {
      frameWidth: 192 / 4,
      frameHeight: 32,
    });

    this.load.pack("pack", "assets/asset-pack.json");
    this.load.image("hud", "assets/enviroment/HUD.png");
    this.load.image("controlsBtn", "assets/enviroment/ControlsBtn.png");
    this.load.image("controlsPallete", "assets/enviroment/ControlsPallete.png");
    this.load.tilemapTiledJSON("map", "tiled/maps/Level1.json");
  }

  create() {
    this.time.delayedCall(1000, () => {
      this.scene.stop("Preloader");
      this.scene.start("Level");
    });
  }
}
