// This file controls Game Display & UI
// 1. Populate a board with tiles/mines 
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

//console.log(board) // DEBUG

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => { // Left Click
          revealTile(board, tile) // Reveal Tile when left Clicked
          checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e => { // Right Click
          e.preventDefault() // prevent menu access inside board
          markTile(tile) // Mark or Unmark Tiles
          listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
      )
  }, 0)
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You Win!! CONGRATULATIONS!!"
  } else if (lose) {
    messageText.textContent = "BOOM!! YOU STEPPED ON A MINE!!"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED && tile.mine) {
          markTile(tile) // Unmark marked tiles w/ mines under them
        }
        if (tile.mine) {
          revealTile(board, tile) // Show all mine locations
        }
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}

// a. Reveal tiles
// 4. Check for Win/Lose