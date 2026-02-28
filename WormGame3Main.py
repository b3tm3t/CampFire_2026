import pygame
import os
pygame.font.init()

#Game Run Vars
WIDTH, HEIGHT = 900, 500
WINDOW = pygame.display.set_mode((WIDTH, HEIGHT))
BORDER = pygame.Rect(WIDTH/2-5, 0, 10, HEIGHT)
pygame.display.set_caption("Worm Game 3")
FPS = 60
statFont = pygame.font.SysFont('applechancery', 30)
#Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
# add worm picture generation here

#Defaults for GameStart
STARTPOS = (WIDTH//2, HEIGHT//2)
STARTLENGTH = 3
WORMSPEED = 5
LIFE = True

def displayRef():
    WINDOW.fill(WHITE)
    #WINDOW.blit(BG)
    pygame.draw.rect(WINDOW, BLACK, BORDER)
    timeText = statFont.render("Time since start: " + str(pygame.time.get_ticks()//1000), 1, BLACK)
    WINDOW.blit(timeText, (WIDTH//3, 10))