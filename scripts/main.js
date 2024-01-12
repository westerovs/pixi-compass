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
    this.createArrow()

    new Dragging(this.app, this.wrapper, this.arrow)
  }

  createItems = () => {
    assetsMap.sprites.forEach(({name}, i) => {
      if (name !== 'arrow') {
        const sprite = new Sprite(Texture.from(name))
        sprite.anchor.set(0.5)
        sprite.position.set((1366 / 2))
        this.wrapper.addChild(sprite)
      }
    })
  }

  createArrow = () => {
    this.arrow = new Sprite(Texture.from('arrow'))
    // this.arrow.anchor.set(0.5)
    this.arrow.position.set(1366 / 2)
    this.wrapper.addChild(this.arrow)
  }
}

new Game().init()

