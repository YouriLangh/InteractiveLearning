import cv2
import numpy as np
import json
import base64
import sys

# Load the image
image_path = sys.argv[1]
image = cv2.imread(image_path)

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
orig_h, orig_w = gray.shape

# Base resolution (reference resolution where parameters work well)
BASE_WIDTH = 1280
BASE_HEIGHT = 960

# Calculate scaling factors
scale_w = orig_w / BASE_WIDTH
scale_h = orig_h / BASE_HEIGHT
scale_factor = (scale_w + scale_h) / 2  # Average scale

# Scaled parameters
PADDING = int(20 * scale_factor)
MIN_AREA = 32 * (scale_factor ** 3)
BLUR_KERNEL = int(7 * scale_factor)
BLUR_KERNEL = BLUR_KERNEL if BLUR_KERNEL % 2 == 1 else BLUR_KERNEL + 1
BLOCK_SIZE = int(21 * scale_factor)
BLOCK_SIZE = BLOCK_SIZE if BLOCK_SIZE % 2 == 1 else BLOCK_SIZE + 1
C_VALUE = 12  # Can be scaled too if needed, keeping it constant for now

# Slight blur to reduce noise
blurred = cv2.GaussianBlur(gray, (BLUR_KERNEL, BLUR_KERNEL), 0)

# Adaptive threshold for better separation regardless of lighting
adaptive_thresh = cv2.adaptiveThreshold(
    blurred,
    255,
    cv2.ADAPTIVE_THRESH_MEAN_C,
    cv2.THRESH_BINARY_INV,
    blockSize=BLOCK_SIZE,
    C=C_VALUE
)

# Morphological operations to clean small noise
kernel = np.ones((3, 3), np.uint8)
opened = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_OPEN, kernel, iterations=2)

# Find contours
contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

output_image_bgr = image.copy()

ctr = 0
# Loop through contours
for cnt in contours:
    area = cv2.contourArea(cnt)
    perimeter = cv2.arcLength(cnt, True)

    # Filtering based on area and circularity
    if area < MIN_AREA or perimeter == 0:
        continue

    circularity = 4 * np.pi * (area / (perimeter ** 2))
    if 0.8 < circularity <= 1.5:
        x, y, w, h = cv2.boundingRect(cnt)
        x_pad = max(0, x - PADDING)
        y_pad = max(0, y - PADDING)
        w_pad = min(orig_w, x + w + PADDING)
        h_pad = min(orig_h, y + h + PADDING)

        cv2.rectangle(output_image_bgr, (x_pad, y_pad), (w_pad, h_pad), (255, 255, 255), 8)
        ctr += 1

# Encode output image
_, buffer = cv2.imencode('.jpeg', output_image_bgr)
img_base64 = base64.b64encode(buffer).decode('utf-8')

# Output JSON
result = {
    "resolution": f"{orig_h} x {orig_w}",
    "count": ctr,
    "image": img_base64
}
json_result = json.dumps(result)
print(json_result)