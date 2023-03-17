// Wait for all HTML to load, then run the JS to create a 10 x 10 grid

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    const flagsLeft = document.querySelector("#flags-left")
    const result = document.querySelector("#result")
    let flags = 0
    let width = 10
    let bombAmount = 20
    let squares = []
    let isGameOver = false

    // Render the gameboard:
    function createBoard() {
        //flagsLeft.innerHTML = bombAmount

        //create shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill("bomb") // Create Bombs
        const emptyArray = Array(width * width - bombAmount).fill("valid") // Create Empty spaces
        const gameArray = emptyArray.concat(bombArray) // append bomb array to empty array
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5) // Shuffle the bombs around

        for(let i = 0; i < width * width; i++) {
            const square = document.createElement("div") // Create 100 div's in our document
            square.setAttribute("id", i) // Give each one an ID from 0 - 99
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // Add event Listener for Normal Click:
            square.addEventListener("click", function(e) {
                click(square) // pass a square in every time mouse is clicked
            })

            // Ctrl and Right CLick
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // Add the numbers around the bombs
        for (let i = 0; i < squares.length; i++) { // special fix for right and left edge squares
            let total = 0
            const isLeftEdge = (i % width === 0) // all multiples of 10 are mod 0
            const isRightEdge = (i % width === width - 1) // all right edges have remainder width - 1

            if (squares[i].classList.contains("valid")) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++ // Check East Square
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++ // 
                if (i > 10 && squares[i - width].classList.contains("bomb")) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++
                if (i < 89 && squares[i + width].classList.contains("bomb")) total++
                squares[i].setAttribute("data", total)
                console.log(squares[i])
            }
        }
    }
    createBoard()

    // Add flags with Right Click:
    function addFlag(square) {
        if (isGameOver) return // do nothing if game is over.
        if (!square.classList.contains("checked") && (flags < bombAmount)) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag")
                square.innerHTML = "🚩"
                flags++
                //flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove("flag")
                square.innerHTML = ""
                flags--
                //flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    // Action for when user clicks square:
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains("checked") || square.classList.contains("flag")) return
        if (square.classList.contains("bomb")) { // If you click a bomb
            //alert("GAME OVER!!") // Replace with Custom Modal
            gameOver(square)
        } else { // You clicked a spot adjacent to a bomb (number space)
            let total = square.getAttribute("data")
            if (total != 0) { // BUG?? (total > 0) ?
                square.classList.add("checked") // Indicate that user clicked a square
                if (total == 1) square.classList.add("ONE")
                if (total == 2) square.classList.add("TWO")
                if (total == 3) square.classList.add("THREE")
                if (total == 4) square.classList.add("FOUR")
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add("checked") // You Clicked a square w/ no bomb & no number
    }


    // Check neighboring squares once square is clicked
    // BUG?? Clicking square 98 or 89 doesnt activate 99 if there is no bomb around
    function checkSquare(square, currentId) {
        const isLeftEdge2 = (currentId % width === 0)
        const isRightEdge2 = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge2) {
                //const newId = squares[parseInt(currentId) - 1].id
                const newId = parseInt(currentId) - 1 // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive function call
            }
            if (currentId > 9 && !isRightEdge2) {
                //const newId = squares[parseInt(currentId) + 1 - width].id
                const newId = parseInt(currentId) + 1 - width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId > 10) {
                // const newId = squares[parseInt(currentId - width)].id
                const newId = parseInt(currentId) - width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId > 11 && !isLeftEdge2) {
                //const newId = squares[parseInt(currentId) - 1 - width].id
                const newId = parseInt(currentId) - 1 - width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId  < 98 && !isRightEdge2) {
                //const newId = squares[parseInt(currentId) + 1].id
                const newId = parseInt(currentId) + 1 // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId < 90 && !isLeftEdge2) {
                //const newId = squares[parseInt(currentId) - 1 + width].id
                const newId = parseInt(currentId) - 1 + width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId < 88 && !isRightEdge2) {
                //const newId = squares[parseInt(currentId) + 1 + width].id
                const newId = parseInt(currentId) + 1 + width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
            if (currentId < 89 && !isRightEdge2) {
                //const newId = squares[parseInt(currentId) + width].id
                const newId = parseInt(currentId) + width // refactor
                const newSquare = document.getElementById(newId)
                click(newSquare) // recursive call again
            }
        }, 100) // 10 milliseconds delay
    }

    // Game Over Script:
    function gameOver(square) {
        //result.innerHTML = "BOOM! GAME OVER!!"
        console.log("BOOM!! GAME OVER!!")
        isGameOver = true
    
        // Show all the bomb locations:
        squares.forEach(square => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣" // Where to get the emoticons?
                square.classList.remove("bomb")
                square.classList.add("checked")
            }
        })
    }

    // Check for a winning condition:
    function checkForWin() {
        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
                matches++
            }
            if (matches === bombAmount) {
                //result.innerHTML = "YOU WIN!!"
                console.log("YOU WIN!!!")
                isGameOver = true
            }
        }
    }
})