from PIL import Image

# twelve = Image.open("twelve-white-bg.png").convert("RGBA")
# W, H = twelve.size
# W *= 2
# img = Image.new("RGBA", (W, H), color=(255, 255, 255, 255))
# img.paste(twelve, (W // 4, 0))

img = Image.open("twelve-white-bg.png").convert("RGBA")
W, H = img.size
pixels = img.load()
print(img.mode)

for x in range(W):
    for y in range(H):
        r, g, b, _ = pixels[x, y]
        R, G, B = (75, 0, 130)
        FF = 255
        dr = max(0, r - R)
        dg = max(0, g - G)
        db = max(0, b - B)
        a = 255 - round((dr / (FF - R) + dg / (FF - G) + db / (FF - B)) / 3 * 255)
        pixels[x, y] = (r, g, b, a)

img.save("twelve-title.png")
