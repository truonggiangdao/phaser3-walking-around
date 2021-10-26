import Phaser from 'phaser';
import { MainScene } from './scenes/main';
import { Dimention, Gravity } from './config';
// import { RpgCharacter } from './plugins/rpgCharactor';

const { width, height } = Dimention;

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'root',
    width,
    height,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: MainScene,
};

export const game = new Phaser.Game(config);
