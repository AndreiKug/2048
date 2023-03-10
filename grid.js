import { Cell } from "./cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

// Класс со всеми ячейками
export class Grid {
    constructor(gridElement) {
        this.cells = []; // Создаем 16 ячеек, сохраняем их в массив cells
        for (let i = 0; i < CELLS_COUNT; i++) {
            this.cells.push(
                new Cell(gridElement, i % GRID_SIZE, Math.floor( i / GRID_SIZE)) //берем остаток от деления i на 4 (GRID_SIZE), X будет меняться от 0 до 3. 
                // И берем целую часть от деления i на 4. Первые четыре элемента получат y = 0, следующие 1 и т.д.
            );
            
        }

        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse()); // меняем порядок ячеек наоборот 
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse()); // меняем порядок ячеек в строке наоборот
    }

    getRandomEmptyCell() { 
        const emptyCells = this.cells.filter(cell => cell.isEmpty()); //Ищем все пустые ячейки
        const randomIndex = Math.floor(Math.random() * emptyCells.length); // Ищем случайную ячейку среди всех пустых
        return emptyCells[randomIndex];
    }

    groupCellsByColumn() { //группируем ячейки в новый массив
        return this.cells.reduce((groupedCells, cell) => { //получаемый новый массив и оставляем нетронутыми ячейки. groupCells - будет записываться значений каждой итерации.
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells; // Для корректной работы reduce
        }, [])
    }

    groupCellsByRow() {
        return this.cells.reduce((groupedCells, cell) => { 
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;  
        }, [])
    }


}