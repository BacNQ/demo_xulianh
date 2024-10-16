from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from scipy.signal import wiener

app = Flask(__name__)
CORS(app)

def encode_image_to_base64(image):
    """Chuyển đổi ảnh sang dạng base64 để truyền qua HTTP."""
    _, buffer = cv2.imencode('.png', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    return encoded_image

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['image']
    if not file:
        return "No file uploaded", 400

    # Đọc file ảnh và chuyển sang dạng grayscale
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

    # 1. Làm mờ ảnh
    blurred_img = cv2.GaussianBlur(img, (9, 9), 10)

    # 2. Thêm nhiễu vào ảnh
    noise = np.random.normal(0, 10, img.shape)
    noisy_img = img + noise

    # 3. Làm mờ và thêm nhiễu vào ảnh
    blur_noisy_img = blurred_img + np.random.normal(0, 10, img.shape)

    # Phục chế ảnh bằng bộ lọc Wiener
    restored_blurred = wiener(blurred_img, (5, 5))
    restored_blurred = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX)
    restored_noisy = wiener(noisy_img, (5, 5))
    restored_blur_noisy = wiener(blur_noisy_img, (5, 5))

    # Chuyển đổi các ảnh sang base64
    results = {
        "original": encode_image_to_base64(img),
        "blurred": encode_image_to_base64(blurred_img),
        "noisy": encode_image_to_base64(noisy_img),
        "blur_noisy": encode_image_to_base64(blur_noisy_img),
        "restored_blurred": encode_image_to_base64(restored_blurred),
        "restored_noisy": encode_image_to_base64(restored_noisy),
        "restored_blur_noisy": encode_image_to_base64(restored_blur_noisy),
    }

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
