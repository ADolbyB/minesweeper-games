from piece import Piece
from random import random

class Board():
    def __init__(self, size, prob):
        self.size = size
        self.prob = prob
        self.setBoard()

    def setBoard(self):
        self.board = []
        for row in range(self.size[0]):
            row = []
            for col in range(self.size[1]):
                hasbomb = random() < self.prob
                piece = Piece(hasbomb) # each piece on the minesweeper board.
                row.append(piece)
            self.board.append(row)

    def getSize(self):
        return self.size

    def getPiece(self, index):
        return self.board[index[0]][index[1]] # get row and column of the board array