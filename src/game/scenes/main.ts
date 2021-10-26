import Phaser from 'phaser';
import { bombSound, shootSound, entrySound, collectSound } from '../assets/audio';
import { ground, background } from '../assets/images';
import { char } from '../assets/sprites';
import { RpgCharacter } from '../plugins/rpgCharactor';
import { CharactorManager } from './CharactorMngr';
import { SceneSound } from './sceneSound';
import { createWelcomeDiv } from './welcome';

export class MainScene extends Phaser.Scene {
  bg: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  spawnPoint = {
    x: 50,
    y: 50
  };
  player: RpgCharacter;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  sceneSounds: SceneSound = {
    entry: null, // for start game
    collect: null, // for fire touch star
    shoot: null, // for fire
    bomb: null // for bomb touch player
  };

  animsManager: CharactorManager = null;

  constructor() {
    super({});
    this.animsManager = new CharactorManager(this);
  }

  preload() {
    this.load.image(background.name, background.src);
    this.load.image(ground.name, ground.src);

    this.animsManager.preload();

    this.load.audio(entrySound.name, entrySound.src);
    this.load.audio(collectSound.name, collectSound.src);
    this.load.audio(shootSound.name, shootSound.src);
    this.load.audio(bombSound.name, bombSound.src);
  }

  initPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, ground.name).setScale(2).refreshBody();
    this.platforms.create(400, (-1 * ground.height - 10), ground.name).setScale(2).refreshBody();

    return this.platforms;
  }

  initPlayer() {
    this.player = new RpgCharacter({
      scene: this,
      x: this.spawnPoint.x,
      y: this.spawnPoint.y,
      name: char.name,
      image: char.name,
      speed: 225,
      path: false,
    });

    this.player.setTexture(char.name, char.name + '-front');

    return this.player;
  }

  initCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  initSound() {
    this.sceneSounds.entry = this.sound.add(entrySound.name);
    this.sceneSounds.collect = this.sound.add(collectSound.name);
    this.sceneSounds.shoot = this.sound.add(shootSound.name);
    this.sceneSounds.bomb = this.sound.add(bombSound.name);
  }

  handlePlayerMovements() {
    if (this.cursors.left.isDown) {
      this.player.SetInstruction({ action: 'walk', option: 'left' });
    }
    else if (this.cursors.right.isDown) {
      this.player.SetInstruction({ action: 'walk', option: 'right' });
    }
    else if (this.cursors.up.isDown) {
      this.player.SetInstruction({ action: 'walk', option: 'back' });
    }
    else if (this.cursors.down.isDown) {
      this.player.SetInstruction({ action: 'walk', option: 'front' });
    }
    this.player.update();
  }

  create() {
    this.initSound();

    this.bg = this.add.image(0, 0, background.name).setOrigin(0, 0);

    const platforms = this.initPlatforms();

    const player = this.initPlayer();

    this.animsManager.create();

    this.physics.add.collider(player, platforms);

    this.initCursor();

    this.scene.pause();
    const div = createWelcomeDiv();
    div.addEventListener('click', () => {
      this.sceneSounds.entry.play();
      div.classList.add('hide');
      this.scene.resume();
    });
  }

  update() {
    this.handlePlayerMovements();
  }
}
