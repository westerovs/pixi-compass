/*
1 Создай метод для расчета расстояния между двумя точками.
2 Создай метод для нахождения ближайшего предмета.
3 В методе onDragMove вызови методы для расчета расстояния и поиска ближайшего предмета.
4 Используй результаты для поворота стрелочки в нужное направление.
* */

export default class Dragging {
  constructor(app, wrapper, arrow) {
    this.app = app
    this.wrapper = wrapper
    this.arrow = arrow

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

    this.arrow.interactive = true
    this.arrow.on('pointerdown', this.onDragStart)
    this.arrow.on('pointerup', this.onDragEnd)
    this.arrow.on('pointerupoutside', this.onDragEnd)
  }

  onDragStart = (event) => {
    this.arrow = event.target

    const touch = event.data.global
    this.offsetTouch = {
      x: touch.x - this.arrow.getGlobalPosition().x,
      y: touch.y - this.arrow.getGlobalPosition().y,
    }
    this.initPosition = {
      x: this.arrow.x,
      y: this.arrow.y
    }

    this.stage.on('pointermove', this.onDragMove)
  }

  onDragMove = (event) => {
    const touch = event.data.global

    const parentOffset = {
      x: this.arrow.parent ? this.arrow.parent.x : 0,
      y: this.arrow.parent ? this.arrow.parent.y : 0,
    }

    this.arrow.x = touch.x - this.offsetTouch.x - parentOffset.x
    this.arrow.y = touch.y - this.offsetTouch.y - parentOffset.y

    // Добавим здесь логику для поворота стрелочки к ближайшему предмету
    this.rotateArrowTowardsNearestItem();
  }

  onDragEnd = () => {
    this.stage.off('pointermove', this.onDragMove)
  }

  // -------------------------
  rotateArrowTowardsNearestItem = () => {
    const arrowGlobalPos = this.arrow.getGlobalPosition();
    const nearestItem = this.findNearestItem(arrowGlobalPos);

    if (nearestItem) {
      const angle = Math.atan2(
        nearestItem.y - arrowGlobalPos.y,
        nearestItem.x - arrowGlobalPos.x
      );

      // Переводим радианы в градусы и поворачиваем стрелочку
      this.arrow.rotation = angle + Math.PI / 2;
    }
  };

  findNearestItem = (arrowPos) => {
    let minDistance = Infinity;
    let nearestItem = null;

    this.wrapper.children.forEach((item) => {
      if (item !== this.arrow) {
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
