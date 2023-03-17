from game import Game
from board import Board

size = (20, 50) # Board Size
prob = 0.02 # bomb probability per section
board = Board(size, prob)
screenSize = (1700, 800)

game = Game(board, screenSize)
game.run()