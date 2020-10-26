/* eslint-disable no-unused-vars */

function cellClickHandler(e) {
    const targetCell = e.target.closest('.cell');
    if (!targetCell || targetCell.id === '0') {
        return;
    }

    const num = +targetCell.id; // преобразуем String --> Number
    const canCellMove = checkCell(num);

    if (!canCellMove) {
        return;
    }

    // ячейка может двигаться: обновляем массив и страницу
    const numIdx = cells.indexOf(num);
    const zeroIdx = cells.indexOf(0);
    cells[numIdx] = 0;
    cells[zeroIdx] = num;

    const zeroCell = document.querySelector('[id="0"]');
    repaintCell(targetCell, 0);
    repaintCell(zeroCell, num);

    const isGameOver = checkGame();

    if (!isGameOver) {
        return;
    }

    stopGame();
    timer.stop();
    winPopup.open();
}

function stopGame() {
    boxElem.removeEventListener('click', cellClickHandler);

    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach(function(el) {
        el.classList.remove('cell_active');
    });
}

/* Проверка закончилась ли игра */
function checkGame() {
    return cells.slice(0, 15).every(function(v, i) {
        return v === i + 1;
    });
}

function checkCell(n) {
    const idx = cells.indexOf(n);

    // ячейка сверху
    const upIdx = idx - 4;
    if ((upIdx >= 0) && (cells[upIdx] === 0) ) {
        return true;
    }

    // ячейка снизу
    const downIdx = idx + 4;
    if ( (downIdx < 16) && (cells[downIdx] === 0) ) {
        return true;
    }

    // ячейка слева
    const leftIdx = idx - 1;
    if ( (leftIdx >= 0) && (idx % 4 !== 0) && (cells[leftIdx] === 0) ) {
        return true;
    }

    // ячейка справа
    const rightIdx = idx + 1;
    if ( (rightIdx < 16) && (rightIdx % 4 !== 0) && (cells[rightIdx] === 0) ) {
        return true;
    }

    return false;
}

/* Активация ячеек */
function activateCells() {
    const cellElems = document.querySelectorAll('.cell');
    cellElems.forEach(function(el) {
        el.classList.add('cell_active');
    });
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}

function resetCells() {
    cells = shuffle(cells);

    const cellElems = document.querySelectorAll('.cell');
    cells.forEach(function(n, i) {
        repaintCell(cellElems[i], n);
    });
}

function renderCells() {
    const cellTemplate = document.querySelector('[data-component="cell"]');

    cells.forEach(function(n) {
        const cellFragment = cellTemplate.content.cloneNode(true);
        const cellElem = cellFragment.querySelector('.cell');

        repaintCell(cellElem, n);
        boxElem.appendChild(cellElem);
    });
}

function repaintCell(cellElem, n) {
    const cellNumElem = cellElem.querySelector('.cell__num');
    cellElem.id = n;
    cellNumElem.textContent = n;
}
