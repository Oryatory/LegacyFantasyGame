// const Phaser = require("phaser");

class Level extends Phaser.Scene {
  constructor() {
    super("Level");
  }

  editorCreate() {
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage("collision", "collisionTiles");

    const sky = this.add.image(0, 0, "sky");
    sky.setScrollFactor(0);
    sky.setOrigin(0, 0);
    const front = this.add.image(0, 0, "front");

    const backMisc = this.add.image(0, front.height - 840, "backgroundMisc");
    backMisc.depth = 0;
    backMisc.setScrollFactor(0.1);
    backMisc.setOrigin(0, 0);

    front.depth = 1;
    front.setOrigin(0, 0);

    const frontMisc = this.add.image(0, front.height - 700, "frontMisc");
    frontMisc.depth = 11;
    frontMisc.setScrollFactor(1.2);
    frontMisc.setOrigin(0, 0);

    const layer = map.createLayer("collisions", tileset, 0, 0);
    layer.setOrigin(0, 0);
    layer.setVisible(false);
    layer.setCollisionBetween(7000, 8000);

    // spaceKey
    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // leftKey
    const leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );

    // rightKey
    const rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    // upKey
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // downKey
    const downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );

    //lightAttackKey
    const lightAttackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.J
    );

    //create enemies
    const boar = new Boar(this, 400, 640);
    this.add.existing(boar);
    const boar2 = new Boar(this, 650, 480);
    this.add.existing(boar2);
    this.boars = [boar, boar2];

    const player = new Player(this, 100, 640);
    this.add.existing(player);

    this.lightAttackHitbox = this.add.rectangle(0, 0, 30, 64, 0xffffff, 0);
    this.physics.add.existing(this.lightAttackHitbox);

    this.physics.add.collider(player, layer);
    this.physics.add.collider(this.lightAttackHitbox, layer);
    this.physics.add.collider(this.boars, layer);

    this.layer = layer;
    this.player = player;
    this.spaceKey = spaceKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.upKey = upKey;
    this.downKey = downKey;
    this.lightAttackKey = lightAttackKey;
    this.front = front;
  }

  create() {
    this.editorCreate();
    this.initCamera();
    this.physics.world.setBounds(0, 0, this.front.width, this.front.height);

    this.createHud();
    this.createPlayerAnimation();
    this.createHealthBars();
    this.physics.world.remove(this.lightAttackHitbox.body);
    this.createLightAttackEvent();
  }

  createHud() {
    const hud = this.add.image(0, 0, "hud");
    hud.depth = 11;
    hud.setScrollFactor(0);
    hud.setOrigin(0);
    this.add.existing(hud);

    // const controlsPallete = this.add.image(320, 70, "controlsPallete");
    // this.controlsPallete = controlsPallete;
    // this.controlsPallete.setScrollFactor(0);
    // this.controlsPallete.setVisible(false);

    // const controlsBtn = this.add.image(320, 25, "controlsBtn");
    // controlsBtn.setScrollFactor(0);
    // controlsBtn.setInteractive();
    // this.controlsBtn = controlsBtn;

    // this.controlsBtn.on("pointerover", () => {
    //   this.controlsPallete.setVisible(true);

    //   this.tweens.add({
    //     targets: [this.controlsPallete],
    //     alpha: { from: 0, to: 1 },
    //     y: { from: 50, to: 70 },
    //     repeat: 0,
    //     duration: 500,
    //   });
    // });
    // this.controlsBtn.on("pointerout", () => {
    //   this.tweens.add({
    //     targets: [this.controlsPallete],
    //     alpha: { from: 1, to: 0 },
    //     y: { from: 70, to: 50 },
    //     repeat: 0,
    //     duration: 500,
    //   });
    // });
  }

  createHealthBars() {
    this.boars.forEach((boar) => {
      boar.depth = 4;
      const healthBarOverlay = this.add.rectangle(
        boar.getBody()?.x * 2,
        boar.getBody()?.y + 0.5,
        20,
        5,
        0xf4abc5,
        1
      );
      const healthBarPoints = this.add.rectangle(
        boar.getBody()?.x * 2,
        boar.getBody()?.y + 0.5,
        17,
        2,
        0xec3a0a,
        1
      );

      healthBarOverlay.depth = 10;
      healthBarPoints.depth = 10;

      const healthBar = {
        healthBarOverlay,
        healthBarPoints,
      };

      boar.healthBar = healthBar;
      this.createBoarAnimation(boar);
    });
  }

  createBoarAnimation(boar) {
    boar.anims.create({
      key: "boar/idle",
      frames: "boar/idle",
      frameRate: 6,
      repeat: 0,
    });
    boar.anims.create({
      key: "boar/walk",
      frames: "boar/walk",
      frameRate: 6,
      repeat: 0,
    });
    boar.anims.create({
      key: "boar/hit",
      frames: "boar/hit",
      frameRate: 8,
      repeat: 0,
    });
    this.boarHitAnimDuration =
      this.boars[0]?.anims?.anims?.entries["boar/hit"]?.duration;
  }

  createPlayerAnimation() {
    this.player.anims.create({
      key: "player/idle",
      frames: "player/idle",
      duration: 0,
      frameRate: 8,
      repeat: -1,
    });
    this.player.anims.create({
      key: "player/run",
      frames: "player/run",
      duration: 0,
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: "player/jump",
      frames: "player/jump",
      // duration: 0,
      frameRate: 10,
      repeat: 0,
    });
    this.player.anims.create({
      key: "player/light-attack",
      frames: "player/light-attack",
      // duration: 0,
      frameRate: 16,
      repeat: 0,
    });
    this.lightAttackAnimDuration =
      this.player.anims.anims.entries["player/light-attack"]?.duration;
  }

  createLightAttackEvent() {
    this.lightAttackKey.on("down", () => {
      if (!this.player.isAttacking && this.player.body.onFloor()) {
        this.player.isAttacking = true;
        this.player.play("player/light-attack", true);
        this.physics.world.remove(this.lightAttackHitbox.body);

        const startHit = (anim, frame) => {
          if (frame.index < 3) {
            return;
          }
          this.physics.world.add(this.lightAttackHitbox.body);
          this.lightAttackHitbox.body.enable = true;

          this.player.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

          this.lightAttackHitbox.x =
            this.player.x +
            (this.player.flipX ? -1 : 1) * this.player.width * 0.18;
          this.lightAttackHitbox.y = this.player.y;
        };

        this.player.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

        this.game.input.enabled = false;
        this.player.body.setOffset(this.player.flipX === false ? 40 : 30, 14);
        this.player.body.velocity.x = 0;

        this.boars.forEach((boar) => {
          this.physics.add.overlap(
            this.lightAttackHitbox,
            boar,
            () => {
              this.handleOverlap(boar, this.lightAttackHitbox);
            },
            undefined,
            this
          );
        });

        this.physics.world.remove(this.lightAttackHitbox.body);
        this.lightAttackHitbox.body.enable = false;
        setTimeout(() => {
          this.player.isAttacking = false;
          this.game.input.enabled = true;

          this.physics.world.remove(this.lightAttackHitbox.body);
          this.lightAttackHitbox.body.enable = false;
          this.damageText?.destroy();
        }, this.lightAttackAnimDuration);
      }
    });
  }

  initCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.layer.width, this.layer.height);
  }

  update() {
    this.movePlayer();
    this.updateHealthBars();

    const cam = this.cameras.main;
    cam.scrollX = Math.floor(this.player.x - cam.width / 2);
    cam.scrollY = Math.floor(this.player.y - cam.height / 2);
  }

  movePlayer() {
    const body = this.player.getBody();

    if (this.game.input.enabled) {
      body.setOffset(20, 14);

      const jumpDown = this.upKey.isDown || this.spaceKey.isDown;
      const leftDown = this.leftKey.isDown;
      const rightDown = this.rightKey.isDown;

      var vel = 180;
      if (jumpDown && body.onFloor()) {
        body.velocity.y = -300;
      }

      if (leftDown) {
        body.velocity.x = -vel;
        if (body.onFloor()) this.player.play("player/run", true);
        this.player.flipX = true;
      } else if (rightDown) {
        body.velocity.x = vel;

        if (body.onFloor()) {
          this.player.play("player/run", true);
          body.setOffset(40, 14);
        }
        this.player.flipX = false;
      } else if (body.onFloor()) {
        body.velocity.x = 0;
        this.player.play("player/idle", true);
      }
      if (!body.onFloor()) {
        this.player.play("player/jump", true);
        if (body.velocity.y > -100 && body.velocity.y < 100) {
          body.setOffset(20, 5);
        }
      }
    }
  }

  updateHealthBars() {
    this.boars.forEach((boar) => {
      if (boar?.healthPoints <= 0) {
        boar.boarHit = true;
        boar.walkEvent.destroy();
        boar.healthBar.healthBarOverlay.destroy();
        boar.healthBar.healthBarPoints.destroy();

        setTimeout(() => {
          boar.destroy();
        }, this.boarHitAnimDuration);
      } else {
        boar.healthBar.healthBarOverlay.x = boar.body.x * 1.03;
        boar.healthBar.healthBarOverlay.y = boar.body.y * 0.96;
        boar.healthBar.healthBarPoints.x = boar.body.x * 1.03;
        boar.healthBar.healthBarPoints.y = boar.body.y * 0.96;
        boar.healthBar.healthBarPoints.width = boar.healthPoints * 0.17;
        boar.healthBar.healthBarOverlay.setStrokeStyle(1, 0x000000, 1);
      }
    });
  }

  handleOverlap(obj1, obj2) {
    const body = obj1.getBody();

    if (!obj1.boarHit) {
      obj1.boarHit = true;
      console.log("-30");
      obj1.healthPoints -= 30;
      body.velocity.x = 20;
      body.velocity.y = -100;

      this.damageText = new Phaser.GameObjects.Text(
        this,
        obj1.x,
        obj1.y - 30,
        `-30`,
        {
          fontSize: 12,
          fontStyle: "strong",
          stroke: "#ffffff",
          strokeThickness: 2,
          resolution: 100,
          color: "rgb(255,0,0)",
        }
      );
      this.physics.add.existing(this.damageText);
      this.damageText.depth = 10;
      this.damageText.body.velocity.y = -100;
      this.damageText.body.velocity.x = 40;

      this.add.existing(this.damageText);
    } else return;

    setTimeout(() => {
      obj1.boarHit = false;
    }, this.boarHitAnimDuration);
  }
}
