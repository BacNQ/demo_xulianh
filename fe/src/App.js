import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [restoredImage, setRestoredImage] = useState('');

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
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
    <div style={{textAlign: 'center'}}>
      <h2>Image Restoration with Wiener Filter</h2>
      <input type="file" onChange={onFileChange} />
      <br/>
      <button onClick={onFileUpload} style={{marginTop: 12, padding: 4}}>Upload & Restore</button>
      <br/>
      {restoredImage && <img src={restoredImage} alt="Restored" style={{ width: '500px', height: 'auto', marginTop: 12}}/>}
    </div>
  );
}

export default App;
