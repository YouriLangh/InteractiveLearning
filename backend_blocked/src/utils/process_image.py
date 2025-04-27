import cv2
import numpy as np
import matplotlib.pyplot as plt
import json
import base64
import sys

# Load the image
image_path = sys.argv[1]
image = cv2.imread(image_path)

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
orig_h, orig_w = gray.shape

# Slight blur to reduce noise
blurred = cv2.GaussianBlur(gray, (7, 7), 0)

# Adaptive threshold for better separation regardless of lighting
adaptive_thresh = cv2.adaptiveThreshold(
    blurred,
    255,
    cv2.ADAPTIVE_THRESH_MEAN_C,
    cv2.THRESH_BINARY_INV,
    blockSize=21,  # Block size for local thresholding
    C=10  # Constant subtracted from mean
)

# Morphological operations to clean small noise
kernel = np.ones((3, 3), np.uint8)
opened = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_OPEN, kernel, iterations=2)

# Find contours
contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

output_image_bgr = image.copy()

# Padding (in pixels)
PADDING = 20  # Adjusted based on actual image resolution

ctr = 0
# Loop through contours
for cnt in contours:
    area = cv2.contourArea(cnt)
    perimeter = cv2.arcLength(cnt, True)

    # Filtering based on area and circularity
    if area < 60  or perimeter == 0:
        continue

    circularity = 4 * np.pi * (area / (perimeter ** 2))
    if 0.5 < circularity <= 1.5:  # Slightly wider range to catch ovals too
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

print(json.dumps(result))
