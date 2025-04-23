import cv2
import sys
import numpy as np
import base64
import json

# Get image path
image_path = sys.argv[1]

# Load image
image = cv2.imread(image_path)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


# Store original dimensions
orig_h, orig_w = gray.shape

# Reference resolution (e.g., from phone image)
REF_WIDTH = 4000
REF_HEIGHT = 3000
REF_AREA = 200  # Area threshold that works well at reference resolution
REF_PADDING = 100  # Optional: padding that works well at reference resolution

# Calculate scale ratio (current image area / reference area)
scale_ratio = (orig_w * orig_h) / (REF_WIDTH * REF_HEIGHT)
min_area = int(REF_AREA * scale_ratio)
PADDING = int(REF_PADDING * np.sqrt(scale_ratio))

# Resize grayscale image for faster processing
gray_small = cv2.resize(gray, (orig_w // 2, orig_h // 2))
resized_h, resized_w = gray_small.shape

# Scale factor from resized back to original
scale_x = orig_w / resized_w
scale_y = orig_h / resized_h

# Preprocessing: enhance contrast and reduce noise
equalized = cv2.equalizeHist(gray_small)
blurred = cv2.GaussianBlur(equalized, (5, 5), 0)

# Threshold to isolate dark dots
_, dark_mask = cv2.threshold(blurred, 40, 255, cv2.THRESH_BINARY_INV)

# Morphological cleanup
kernel = np.ones((3, 3), np.uint8)
cleaned_mask = cv2.morphologyEx(dark_mask, cv2.MORPH_OPEN, kernel)

# Find contours
contours, _ = cv2.findContours(cleaned_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Convert for RGB display
# output_image_rgb = cv2.cvtColor(image.copy(), cv2.COLOR_BGR2RGB)
output_image_bgr = image.copy()

ctr = 0
# Loop through contours and draw padded boxes
for cnt in contours:
    area = cv2.contourArea(cnt)
    perimeter = cv2.arcLength(cnt, True)

    if area < min_area or perimeter == 0:
        continue

    circularity = 4 * np.pi * (area / (perimeter ** 2))
    if 0.7 < circularity <= 1.5:
        ctr += 1
        x, y, w, h = cv2.boundingRect(cnt)
        x = int(x * scale_x)
        y = int(y * scale_y)
        w = int(w * scale_x)
        h = int(h * scale_y)

        # Apply scaled padding
        x_pad = max(0, x - PADDING)
        y_pad = max(0, y - PADDING)
        w_pad = min(orig_w, x + w + PADDING)
        h_pad = min(orig_h, y + h + PADDING)

        cv2.rectangle(output_image_bgr, (x_pad, y_pad), (w_pad, h_pad), (255, 255, 255), 10)
# Encode output image as base64
_, buffer = cv2.imencode('.png', output_image_bgr)
img_base64 = base64.b64encode(buffer).decode('utf-8')

# Output JSON
result = {
    "count": ctr,
    "image": img_base64
}

print(json.dumps(result))
