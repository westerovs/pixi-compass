import {Application, Container, Sprite, Texture} from '../assets/lib/pixi.mjs'
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
    spriteA.name = 'block'
    spriteA.position.set(300)
    const spriteB = new Sprite(Texture.from('blockB'))
    spriteB.name = 'block'
    spriteB.position.set(900, 500)
    const spriteC = new Sprite(Texture.from('blockC'))
    spriteC.name = 'block'
    spriteC.position.set(500, 900)

    this.wrapper.addChild(spriteA, spriteB, spriteC)
  }

  createCompass = () => {
    this.compass = new Sprite(Texture.from('compassBody'))
    this.compass.position.set(500, 500)

    this.arrow = this.createArrow()

    this.compass.addChild(this.arrow)
    this.wrapper.addChild(this.compass)
  }

  createArrow = () => {
    const arrow = new Sprite(Texture.from('arrow'))
    arrow.anchor.set(0.5)
    arrow.position.set((this.compass.width / 2), (this.compass.height / 2))

    return arrow
  }
}

new Game().init()

