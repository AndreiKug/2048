export class Cell {
    constructor(gridElement, x, y) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridElement.append(cell);
        this.x = x;
        this.y = y;
    }

    linkTile(tile) { //сохраняем плитку внутри ячейки
        tile.setXY(this.x, this.y); //устанавливаем координаты
        this.linkedTile = tile;
    }

    unlinkTile(tile) {
        this.linkedTile = null;
    }

    isEmpty() { //Проверяем, есть ли у ячейки привязанная плитка
        return !this.linkedTile;
    }

    linkTileForMerge(tile) { // меняем координаты плтики на новые и сохраняет ссылку на плитку
        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile; // чтобы удалить плитку после объединения
    }

    unlinkTileForMerge() {
        this.linkedTileForMerge = null;
    }

    canAccept(newTile) {
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value); 
        // ячейка сможет принять плитку, если ячейка пустая или
        // или если к ячейке еще не привязали другую для объединения и у текущей и новой плитки одинаковые значения
        // и к текущей плитке не привязаны другая плитка на объединение
    }

    hasTileForMerge() { // возвращаем true, когда к ячейке уже привязали плитку на объединение
        return !!this.linkedTileForMerge;
    }

    mergeTiles () {
        this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value); // Суммируем плитки
        this.linkedTileForMerge.removeFromDOM(); // удаляем плитку
        this.unlinkTileForMerge();
    }
}