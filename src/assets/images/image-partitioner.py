from PIL import Image

img = Image.open('12-opaque-4-3.png')
W, H = img.size

num_rows = 3
num_cols = 4
w = W / num_cols
h = H / num_rows

for i in range(num_rows):
    for j in range(num_cols):
        img_crop = img.crop(box=(j * w, i * h, j * w + w, i * h + h))
        img_crop.save(f'./12-partition/{(i * num_cols + j + 1) % 12}.png')
