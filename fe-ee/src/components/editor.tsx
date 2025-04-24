'use client'
import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function MyEditor({ value, handleChange }: { value: string, handleChange: (i: string) => void }) {

  const  handleEditorChange = (content: string) => {
    handleChange(content);
  };


  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value??""}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
          ],
          toolbar:
            'undo redo |fontfamily fontsize forecolor bold italic underline strikethrough subscript superscript |alignleft aligncenter alignright | bullist numlist | link image  |',
          tinymceScriptSrc: `https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}/tinymce/7/tinymce.min.js`,
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};
