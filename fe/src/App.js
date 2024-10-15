import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [blurredImage, setBlurredImage] = useState(null);
  const [noisyImage, setNoisyImage] = useState(null);
  const [blurNoisyImage, setBlurNoisyImage] = useState(null);
  const [restoredBlurred, setRestoredBlurred] = useState(null);
  const [restoredNoisy, setRestoredNoisy] = useState(null);
  const [restoredBlurNoisy, setRestoredBlurNoisy] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Lấy kết quả trả về từ server và cập nhật state
      setOriginalImage(response.data.original);
      setBlurredImage(response.data.blurred);
      setNoisyImage(response.data.noisy);
      setBlurNoisyImage(response.data.blur_noisy);
      setRestoredBlurred(response.data.restored_blurred);
      setRestoredNoisy(response.data.restored_noisy);
      setRestoredBlurNoisy(response.data.restored_blur_noisy);

    } catch (error) {
      console.error("Lỗi khi tải ảnh lên!", error);
    }
  };

  return (
    <div className="App" style={{textAlign: 'center'}}>
      <h1>Ứng dụng xử lý ảnh</h1>
      <input type="file" onChange={handleFileChange}/>
      <button onClick={handleUpload}>Tải lên và xử lý</button>

      <div className="image-results">
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12}}>
          {originalImage && 
            <div>
              <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh gốc</p>
              <img src={`data:image/png;base64,${originalImage}`} alt="Ảnh gốc" width={'auto'} height={400} />
            </div>}
          {blurredImage &&
            <div>
              <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh làm mờ</p>
              <img src={`data:image/png;base64,${blurredImage}`} alt="Ảnh làm mờ" width={'auto'} height={400} />
            </div>}
          {restoredBlurred &&
            <div>
              <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh sau phục chế</p>
              <img src={`data:image/png;base64,${restoredBlurred}`} alt="Phục chế mờ" width={'auto'} height={400} />
            </div>}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30}}>
          {originalImage &&
            <div>
              <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh gốc</p>
              <img src={`data:image/png;base64,${originalImage}`} alt="Ảnh gốc" width={'auto'} height={400} />
            </div>}
          {noisyImage && <div>
            <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh thêm nhiễu</p>
            <img src={`data:image/png;base64,${noisyImage}`} alt="Ảnh thêm nhiễu" width={'auto'} height={400} />
          </div>}
          {restoredNoisy && <div>
            <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh sau phục chế</p>
            <img src={`data:image/png;base64,${restoredNoisy}`} alt="Phục chế nhiễu" width={'auto'} height={400} />
          </div>}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30}}>
          {originalImage &&
            <div>
              <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh gốc</p>
              <img src={`data:image/png;base64,${originalImage}`} alt="Ảnh gốc" width={'auto'} height={400} />
            </div>}
          {blurNoisyImage && <div>
            <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh thêm mờ và nhiễu</p>
            <img src={`data:image/png;base64,${blurNoisyImage}`} alt="Ảnh mờ + nhiễu" width={'auto'} height={400} />
          </div>}
          {restoredBlurNoisy && <div>
            <p style={{fontSize: 20, fontStyle: 'italic', textAlign: 'center'}}>Ảnh sau phục chế</p>
            <img src={`data:image/png;base64,${restoredBlurNoisy}`} alt="Phục chế mờ + nhiễu" width={'auto'} height={400} />
          </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
