import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [restoredImage, setRestoredImage] = useState('');

  useEffect(() => {
    return () => {
      selectedFile && URL.revokeObjectURL(selectedFile.preview);
    }
  }, [selectedFile])

  const onFileChange = event => {
    const file = event.target.files[0];
    file.preview = URL.createObjectURL(file);
    setSelectedFile(file);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('http://localhost:5000/restore', formData)
      .then(response => {
        console.log('Response:', response.data); // Kiểm tra phản hồi
        setRestoredImage(`data:image/png;base64,${response.data.restored_image}`);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });

  };
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Image Restoration with Wiener Filter</h2>
      <input type="file" onChange={onFileChange} />
      <br/>
      <button onClick={onFileUpload} style={{ padding: 4, marginTop: 16}}>Upload & Restore</button>
      <br/>
      <div style={{display: 'flex', justifyContent: 'center', gap: 24}}>
      {selectedFile && (
        <div>
          <h3 style={{fontStyle: 'italic'}}>Ảnh gốc: </h3>
          <img src={selectedFile.preview} alt='' style={{ width: '500px', height: 'auto'}}/>
        </div>
      )}
      {restoredImage && (
        <div>
          <h3 style={{fontStyle: 'italic'}}>Ảnh sau khi lọc: </h3>
          <img src={restoredImage} alt="Restored" style={{ width: '500px', height: 'auto'}} />
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
