'use client'
import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function MyEditor() {
  const [editorContent, setEditorContent] = useState<string>('');

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = () => {
    console.log('Nội dung đã chỉnh sửa:', editorContent);
  };

  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={editorContent}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
          ],
          toolbar:
            'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image video |',
          tinymceScriptSrc: `https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}/tinymce/7/tinymce.min.js`,
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};
