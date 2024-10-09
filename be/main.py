import cv2
import numpy as np
from scipy.signal import wiener
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

@app.route('/restore', methods=['POST'])
def restore_image():
    # Nhận file ảnh từ request
    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    
    # Áp dụng bộ lọc Wiener
    restored_img = wiener(img, (5, 5))
    
    # Chuyển ảnh về định dạng base64
    _, img_encoded = cv2.imencode('.png', restored_img)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')  # Mã hóa thành base64
    
    return jsonify({'restored_image': img_base64})  # Trả về dưới dạng base64

if __name__ == '__main__':
    app.run(debug=True)
