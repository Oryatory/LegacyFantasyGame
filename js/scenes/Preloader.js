class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  create() {
    this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x975f42);
    this.add.rectangle(232, 124, 320, 100, 0x5a3827);
    this.add.text(128, 96, "Loading...", {
      fontFamily: "Chaparral",
      fontSize: "50px",
      resolution: 32,
    });
  }
}
