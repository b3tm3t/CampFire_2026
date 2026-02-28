import pygame

pygame.init()
fonts = pygame.font.get_fonts()

# Sort them alphabetically and print
for font in sorted(fonts):
    print(font)