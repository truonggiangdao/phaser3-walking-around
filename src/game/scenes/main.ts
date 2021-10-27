import Phaser from 'phaser';
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin';
import { bombSound, shootSound, entrySound, collectSound } from '../assets/audio';
import { ground, background, block } from '../assets/images';
import { char } from '../assets/sprites';
import { Dimention } from '../config';
import { RpgCharacter } from '../plugins/rpgCharactor';
import { CharactorManager } from './CharactorMngr';
import { SceneSound } from './sceneSound';
import { createWelcomeDiv } from './welcome';

export class MainScene extends Phaser.Scene {
  bg: Phaser.GameObjects.Image;
  walls: Phaser.Physics.Arcade.StaticGroup;
  gates: Phaser.Physics.Arcade.StaticGroup;
  spawnPoint = {
    x: Dimention.width * 0.1,
    y: Dimention.height * 0.32
  };
  endPoint = {
    x: Dimention.width * 0.9,
    y: Dimention.height * 0.32
  };
  player: RpgCharacter;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  sceneSounds: SceneSound = {
    entry: null, // for start game
    collect: null, // for fire touch star
    shoot: null, // for fire
    bomb: null // for bomb touch player
  };
  controls: any;

  animsManager: CharactorManager = null;

  constructor() {
    super({});
    this.animsManager = new CharactorManager(this);
  }

  preload() {
    this.load.image(background.name, background.src);
    this.load.image(block.name, block.src);

    this.animsManager.preload();

    this.load.audio(entrySound.name, entrySound.src);
    this.load.audio(collectSound.name, collectSound.src);
    // this.load.audio(shootSound.name, shootSound.src);
    this.load.audio(bombSound.name, bombSound.src);
  }

  initWalls() {
    this.walls = this.physics.add.staticGroup();

    this.walls.create(Dimention.width * 0.4, Dimention.height * 0.25, block.name).setOrigin(1).setScale(10).refreshBody();
    this.walls.create(Dimention.width, Dimention.height * 0.25, block.name).setOrigin(1).setScale(10).refreshBody();
    this.walls.create(Dimention.width * 0.505, Dimention.height * 0.42, block.name).setOrigin(0.5).setScale(5.9).refreshBody();

    this.walls.create(0, Dimention.height * 0.39, block.name).setOrigin(0).setScale(7.2).refreshBody();
    this.walls.create(Dimention.width * 0.685, Dimention.height * 0.39, block.name).setOrigin(0).setScale(10).refreshBody();
    this.walls.create(Dimention.width * 0.3, Dimention.height * 0.835, block.name).setOrigin(0).setScale(10).refreshBody();

    return this.walls;
  }

  initGates() {
    this.gates = this.physics.add.staticGroup();

    this.gates.create(0, Dimention.height * 0.32, block.name).setOrigin(0.5).setScale(2).refreshBody();
    this.gates.create(Dimention.width, Dimention.height * 0.32, block.name).setOrigin(0.5).setScale(2).refreshBody();

    return this.gates;
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
    // this.sceneSounds.shoot = this.sound.add(shootSound.name);
    this.sceneSounds.bomb = this.sound.add(bombSound.name);
  }

  handlePlayerMovements() {
    if (this.cursors.left.isDown) {
      this.player.MoveLeft();
    }
    else if (this.cursors.right.isDown) {
      this.player.MoveRight();
    }
    else if (this.cursors.up.isDown) {
      this.player.MoveUp();
    }
    else if (this.cursors.down.isDown) {
      this.player.MoveDown();
    }
    this.player.update();
  }

  isPlayerAtEntrance() {
    const { x } = this.player.getCenter();
    return (x < Dimention.width * 0.5);
  }

  handleAccessGates() {
    if (this.isPlayerAtEntrance()) {
      this.player.setPosition(this.endPoint.x, this.endPoint.y);
    } else {
      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    }
    this.sceneSounds.collect.play();
  }

  updateControlState() {
    const cursorKeys = this.controls.createCursorKeys();
    let hasKeydown = false;
    for (var name in cursorKeys) {
      if (cursorKeys[name].isDown) {
        hasKeydown = true;
      }
    }
    if (hasKeydown) {
      const angle = Math.round(this.controls.angle);
      if (angle < 125 && angle > 45) {
        this.player.MoveDown();
      } else if (angle <= 45 && angle > -45) {
        this.player.MoveRight();
      } else if (angle <= -45 && angle > -125) {
        this.player.MoveUp();
      } else {
        this.player.MoveLeft();
      }
      this.player.update();
    }
  }

  initControl() {
    this.controls = (this.plugins.get('rexVirtualJoystick') as VirtualJoyStickPlugin).add(this, {
      x: Dimention.width * 0.15,
      y: Dimention.height * 0.75,
      radius: 60,
      base: this.add.circle(0, 0, 70, 0xffffff),
      thumb: this.add.circle(0, 0, 40, 0x888888),
      dir: '4dir',
    });
  }

  create() {
    this.initSound();

    this.bg = this.add.image(0, 0, background.name).setOrigin(0, 0);

    const walls = this.initWalls();

    const gates = this.initGates();

    const player = this.initPlayer();

    this.animsManager.create();

    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, gates, this.handleAccessGates, null, this);

    this.initCursor();

    this.initControl();

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
    this.updateControlState();
  }
}
