import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard); // Класс со всеми ячейками
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard)); // находим рандомную ячейку и привязываем к ней созданную плитку
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", handleInput, { once: true }); //Подписываемся на нажатие клавиши только 1 раз
}

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;
        default:
            setupInputOnce(); // добавляем, чтобы снова подписаться на нажатие новой клавиши
            return; // т.к. мы не должны реагировать на нажатие других клавиш
    }

    const newTile = new Tile(gameBoard)
    grid.getRandomEmptyCell().linkTile(newTile); // Создаем новую плитку после каждого перемещения

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        alert('Try again and press F5');
        return;
    }

    setupInputOnce(); // после нажатия клавиши подписываемся снова на еще одно нажатие
}

async function moveUp() { //сдвигаем вверх по сгруппированным ячейкам
    await slideTiles(grid.cellsGroupedByColumn); 
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
    const promises = []; // Для задержки анимации объединения плиток

    groupedCells.forEach(group => slideTilesInGroup(group, promises)); //slideTilesInGroup сгруппирует все 4 столбца с ячейками

    await Promise.all(promises); // Дожидаемся окончания анимации всех  плиточек

    grid.cells.forEach( cell => { // Объекдинение плиток
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

function slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) { // не учитываем верхние ячейки, т.к. их некуда поднимать, поэтому i = 1
        if (group[i].isEmpty()) {
            continue; // Если ячейка без плитки, прерываем текущую итерацию
        }
        
        const cellWithTile = group[i];

        let targetCell; // целевая ячейка для перемещения
        let j = i - 1; // Проходим цикл по ячейкам выше нашей, поэтоум i - 1
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) //Цикл до самого верха 
        {
            targetCell = group[j];
            j--;
        }

        if (!targetCell) { //Если подходящая для перемещения ячейка не найдена, прерываем итерацию
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd()); //ожидание окончания анимации

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile); // Если найденная ячейка пустая, привязываем к ней плитку
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile); // Если найденная ячейкая занята
        }

        cellWithTile.unlinkTile(); // отвязываем плитку от ячейки
    }
}

function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn);
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn);
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow);
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group)); // Проверяем, что хоть в каком-то из столбцов можем двигаться вверх
}

function canMoveInGroup(group) { //Проверяем четыре ячейки в столбце
    return group.some((cell, index) => { // проверяем, может ли хоть какая-нибудь ячейка передвинуться вверх
        if (index == 0) { // 0 - самамя верхняя ячейка, выше двигаться некуда
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1]; // Если мы можем передвинуться хотя бы в соседнюю сверху, этого достаточно
        return targetCell.canAccept(cell.linkedTile);

    });
}


