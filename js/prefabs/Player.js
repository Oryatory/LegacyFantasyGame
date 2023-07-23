class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x ?? 0, y ?? 0, texture || "player/idle");

    scene.physics.add.existing(this, false);
    this.body.setSize(24, 50, true);
    // this.body.immovable = true;
    this.depth = 10;
    this.body.collideWorldBounds = true;
    // this.body.setOffset(20, 14);
    this.isAttacking = false;
  }

  getBody() {
    return this.body;
  }
}
