'use client'
import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyEditor: React.FC = () => {
  const [editorContent, setEditorContent] = useState<string>('');

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = () => {
    console.log('Nội dung đã chỉnh sửa:', editorContent);
    // Gửi nội dung lên server hoặc xử lý theo nhu cầu
  };

  return (
    <div>
      <h1>Trình soạn thảo văn bản</h1>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={editorContent}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview'
          ],
          toolbar:
            'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
          // 🛠 Chỉ định URL TinyMCE đúng
          tinymceScriptSrc: `https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}/tinymce/7/tinymce.min.js`,
        }}
        onEditorChange={handleEditorChange}
      />

      <button onClick={handleSubmit}>Gửi nội dung</button>
    </div>
  );
};

export default MyEditor;
