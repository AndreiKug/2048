export class Tile {
    constructor(gridElement) {
        this.tileElement = document.createElement("div");
        this.tileElement.classList.add("tile");
        this.setValue(Math.random() > 0.5 ? 2 : 4); // У начальной плитки должно быть случайное значение 2 или 4
        gridElement.append(this.tileElement);
    }

    setXY(x, y) { //Меняем X и Y внутри плитки на новые
        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty("--x", x);
        this.tileElement.style.setProperty("--y", y);
    }

    setValue(value) { // Для изменения значения плитки, цвета и текста
        this.value = value; 
        this.tileElement.textContent = value;

        const bgLightness = 100 - Math.log2(value) * 9; //Math.log2 - для определения степени числа, чем больше число, тем оно темнее
        this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
        this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
    }

    removeFromDOM() {
        this.tileElement.remove();
    }

    waitForTransitionEnd () { 
        return new Promise(resolve => {
            this.tileElement.addEventListener("transitionend", resolve, {once: true}); // promise завершится, когда закончится анимация плитки
        });
    }

    waitForAnimationEnd () {
        return new Promise(resolve => {
            this.tileElement.addEventListener("animationend", resolve, {once: true}); // promise завершится, когда закончится анимация плитки
        });
    }
}