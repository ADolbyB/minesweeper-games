from game import Game
from board import Board

size = (9, 9) # Board Size
prob = 0.5 # bomb probability per section
board = Board(size, prob)
screenSize = (600, 600)

game = Game(board, screenSize)
game.run()