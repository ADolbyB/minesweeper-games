from game import Game
from board import Board

size = (10, 10) # Board Size
prob = 0.2 # bomb probability per section
board = Board(size, prob)
screenSize = (700, 700)

game = Game(board, screenSize)
game.run()