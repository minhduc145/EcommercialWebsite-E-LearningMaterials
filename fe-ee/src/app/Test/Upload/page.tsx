'use client'
import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Vui lòng chọn file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Backend nhận với tên 'file'

    try {
      setStatus('Đang upload...');
      const res = await axios.post('http://localhost:8080/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('Upload thành công!');
    } catch (error) {
      console.error(error);
      setStatus('Upload thất bại!');
    }
  };

  return (
    <div className='reset' style={{ padding: 20 }}>
      <h2>Upload file</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
}
