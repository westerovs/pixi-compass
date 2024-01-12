export default class Dragging {
  constructor(app, wrapper, compass, arrow) {
    this.app = app
    this.wrapper = wrapper
    this.compass = compass
    this.arrow = arrow

    this.dragTarget = this.compass
    this.stage = app.stage

    this.offsetTouch = {
      x: null,
      y: null,
    }
    this.initPosition = {x: null, y: null}

    this.init()
  }

  init = () => {
    this.stage.interactive = true
    this.stage.hitArea = this.app.screen

    this.dragTarget.interactive = true
    this.dragTarget.on('pointerdown', this.onDragStart)
    this.dragTarget.on('pointerup', this.onDragEnd)
    this.dragTarget.on('pointerupoutside', this.onDragEnd)
  }

  onDragStart = (event) => {
    this.dragTarget = event.target

    const touch = event.data.global
    this.offsetTouch = {
      x: touch.x - this.dragTarget.getGlobalPosition().x,
      y: touch.y - this.dragTarget.getGlobalPosition().y,
    }
    this.initPosition = {
      x: this.dragTarget.x,
      y: this.dragTarget.y
    }

    this.stage.on('pointermove', this.onDragMove)
  }

  onDragMove = (event) => {
    const touch = event.data.global

    const parentOffset = {
      x: this.dragTarget.parent ? this.dragTarget.parent.x : 0,
      y: this.dragTarget.parent ? this.dragTarget.parent.y : 0,
    }

    this.dragTarget.x = touch.x - this.offsetTouch.x - parentOffset.x
    this.dragTarget.y = touch.y - this.offsetTouch.y - parentOffset.y

    // Добавим здесь логику для поворота стрелочки к ближайшему предмету
    this.rotateArrowTowardsNearestItem();
  }

  onDragEnd = () => {
    this.stage.off('pointermove', this.onDragMove)
  }

  // -------------------------
  rotateArrowTowardsNearestItem = () => {
    const compassGlobalPos = this.compass.getGlobalPosition();
    const nearestItem = this.findNearestItem(compassGlobalPos);

    if (nearestItem) {
      const y = nearestItem.y - compassGlobalPos.y
      const x = nearestItem.x - compassGlobalPos.x
      const angle = Math.atan2(y, x)

      // Переводим радианы в градусы и поворачиваем стрелочку
      this.arrow.rotation = angle + Math.PI / 2;
    }
  };

  findNearestItem = (arrowPos) => {
    let minDistance = Infinity;
    let nearestItem = null;

    this.wrapper.children.forEach((item) => {
      if (item.name === 'block') {
        const distance = this.calculateDistance(arrowPos, item.getGlobalPosition());

        if (distance < minDistance) {
          minDistance = distance;
          nearestItem = item;
        }
      }
    });

    return nearestItem;
  };

  calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

}
