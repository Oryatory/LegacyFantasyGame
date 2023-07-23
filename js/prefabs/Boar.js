// const Phaser = require("phaser");

class Boar extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x ?? 0, y ?? 0, texture || "boar/idle");
    this.healthPoints = 100;

    scene.physics.add.existing(this, false);
    this.body.setSize(38, 26, true);
    this.body.setOffset(10, 6);
    this.body.collideWorldBounds = true;
    this.boarHit = false;
    // this.body.immovable = true;

    this.walkEvent = this.scene.time.addEvent({
      loop: true,
      delay: 2000,
      callback: () => this.walkBoar(),
    });

    this.isMoving = false;
  }

  getBody() {
    return this.body;
  }

  walkBoar() {
    const body = this.getBody();

    setTimeout(() => {
      this.isMoving = !this.isMoving;
    }, 2000);
    if (this.isMoving) {
      body.velocity.x = 0;
      this.flipX = !this.flipX;
      body.velocity.x = this.flipX ? 50 : -50;
    } else {
      body.velocity.x = 0;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const body = this.getBody();

    if (!body) {
      return;
    }
    if (this.boarHit) {
      this.play("boar/hit", true);
    } else if (this.body.velocity.x !== 0) {
      this.play("boar/walk", true);
    } else {
      this.play("boar/idle", true);
    }
  }
}
