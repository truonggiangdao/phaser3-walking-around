import { Scene } from 'phaser';
import { char } from '../assets/sprites';

export class CharactorManager {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.atlas(char.name, char.src, char.json);
  }

  create() {
    const anims = this.scene.anims;

    anims.create({
      key: "char-walk-left",
      frames: anims.generateFrameNames("char", { prefix: "char-walk-left.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "char-walk-right",
      frames: anims.generateFrameNames("char", { prefix: "char-walk-right.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "char-walk-front",
      frames: anims.generateFrameNames("char", { prefix: "char-walk-front.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "char-walk-back",
      frames: anims.generateFrameNames("char", { prefix: "char-walk-back.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }
}