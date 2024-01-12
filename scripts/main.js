import {Application, Rectangle, Container, Sprite, Texture} from '../assets/lib/pixi.mjs'
import {assetsMap} from './assetsMap.js'
import {config} from './config.js'
import Dragging from './components/Dragging.js'

const App = new Application(config)
document.body.appendChild(App.view)

class Game {
  constructor() {
    this.app = App

    this.wrapper = new Container()
    this.wrapper.position.set(0, 0)
    this.app.stage.addChild(this.wrapper)
    this.wrapper.sortableChildren = true

    this.compass = null
    this.arrow = null

    this.app.ticker.add(this.update);

  }

  preload() {
    assetsMap.sprites.forEach((value) =>
      this.app.loader.add(value.name, value.url))

    this.app.loader.onComplete.add(() => {
      this.startGame()
    })
  }

  init() {
    this.preload()
    this.app.loader.load()
  }

  startGame = () => {
    this.createItems()
    this.createCompass()

    new Dragging(this.app, this.wrapper, this.compass, this.arrow)
  }

  createItems = () => {
    const spriteA = new Sprite(Texture.from('blockA'))
    spriteA.position.set(300)
    const spriteB = new Sprite(Texture.from('blockB'))
    spriteB.position.set(900, 500)
    const spriteC = new Sprite(Texture.from('blockC'))
    spriteC.position.set(500, 900)

    this.wrapper.addChild(spriteA, spriteB, spriteC)
  }

  createCompass = () => {
    this.compass = new Sprite(Texture.from('compassBody'))
    this.compass.position.set(500, 500)
    this.wrapper.addChild(this.compass)

    this.createArrow()

    // Установим sortable для контейнера с arrow
    this.compass.sortableChildren = true;
  }

  createArrow = () => {
    this.arrow = new Sprite(Texture.from('arrow'))
    this.arrow.anchor.set(0.5)
    this.arrow.position.set(
      (this.compass.width / 2),
      (this.compass.height / 2),
    )
    this.compass.addChild(this.arrow)
  }

  update = () => {
    // if (this.arrow) {
    //   this.arrow.angle += 1
    // }
  }

}

new Game().init()

