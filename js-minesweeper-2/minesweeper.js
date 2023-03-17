// Game Logic

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)

    console.log(minePositions) // DEBUG

    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                },
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
        return // If tile revealed already (no number) or revelealed already (with number)
    }

    if (tile.status === TILE_STATUSES.MARKED) { // if tile is already marked
        tile.status = TILE_STATUSES.HIDDEN // Unmark Tile
    } else {
        tile.status = TILE_STATUSES.MARKED // Not already marked: Mark tile
    }
}

export function revealTile(board, tile) {
    // console.log(tile) // DEBUG: show attributes of tile clicked on
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return // Do nothing unless if the tile has been marked or revealed
    }
    if (tile.mine) { // If you stepped on a Mine
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(anyTile => anyTile.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || 
                //(tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))
                (tile.mine && (tile.status === TILE_STATUSES.MARKED))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const pos = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }
        if (!positions.some(p => positionMatch(p, pos))) {
            positions.push(pos)
        }
    }

    return positions
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset] // Optional Chaining to fix edges of game board.
            if (tile) {
                tiles.push(tile)
            }
        }
    }

    return tiles
}