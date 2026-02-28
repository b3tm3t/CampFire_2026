import pygame
import os
pygame.font.init()

#Game Run Vars
WIDTH, HEIGHT = 1300, 650
WINDOW = pygame.display.set_mode((WIDTH, HEIGHT))
BORDER = pygame.Rect(WIDTH/2-5, 0, 10, HEIGHT)
pygame.display.set_caption("Worm Game 3")
FPS = 60
statFont = pygame.font.SysFont('applechancery', 20)
keyboard = pygame.key.get_pressed()
movInterval = 0.1
#Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
# add worm picture generation here

#Defaults for GameStart
wormX, wormY = WIDTH//2, HEIGHT//2
STARTLENGTH = 3
WORMSPEED = 5
xMomentum, yMomentum = 5, 0
xMomentum + yMomentum == WORMSPEED
LIFE = True

def displayRef():
    WINDOW.fill(WHITE)
    #WINDOW.blit(BG)
    pygame.draw.rect(WINDOW, BLACK, BORDER)
    timeText = statFont.render("Time since start: " + str(pygame.time.get_ticks()//1000), 1, BLACK)
    WINDOW.blit(timeText, (WIDTH//3, 10))
    pygame.display.update()

def movement(keyboard, wormX, wormY):
    if keyboard[pygame.K_RIGHT]:
        if xMomentum <= WORMSPEED:
            xMomentum += movInterval
    elif keyboard[pygame.K_LEFT]:
        if xMomentum >= -WORMSPEED:
            xMomentum -= movInterval
    elif keyboard[pygame.K_UP]:
        if yMomentum <= WORMSPEED:
            yMomentum += movInterval
    elif keyboard[pygame.K_DOWN]:
        if yMomentum >= -WORMSPEED:
            yMomentum -= movInterval

def GUIMain():
    clock = pygame.time.Clock()
    run = True
    while run:
        clock.tick(FPS)
        for event in pygame.event.get():
            key = pygame.key.get_pressed()
            if key[pygame.K_ESCAPE]:
                run = False
        movement(key, wormX, wormY)
        displayRef()
GUIMain()