// import { useEffect, useRef, useState } from "react";
// import EasyMDE from "easymde";
// import "easymde/dist/easymde.min.css";

// type EasyMDEditorProps = {
//   value: string;
//   onChange: (value: string) => void;
// };

// const EasyMDEEditor: React.FC<EasyMDEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<HTMLTextAreaElement | null>(null);
//   const mdeRef = useRef<EasyMDE | null>(null);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (isClient && editorRef.current && !mdeRef.current) {
//       const flameIconSvg = `
//         <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-flame" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M12 2s2 5 0 7-1-1-4-2c-.7 1.3-1 2.3-1 4a6 6 0 0 0 12 0c0-4.2-3-6-3-9 0-2-2-3-4-3z"/>
//         </svg>`;

//       const saveIconSvg = `
//         <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-save" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/>
//           <polyline points="17 21 17 13 7 13 7 21"/>
//           <polyline points="7 3 7 8 15 8"/>
//         </svg>`;

//       const ideaIconSvg = `
//         <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-lightbulb" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <line x1="9" x2="15" y1="18" y2="18"/>
//           <line x1="10" x2="14" y1="22" y2="22"/>
//           <path d="M2 9a10 10 0 1 1 20 0c0 3.84-2.24 6.32-4 7.76a2.54 2.54 0 0 0-.91 1.94v.3a1 1 0 0 1-1 1H8.91a1 1 0 0 1-1-1v-.3a2.54 2.54 0 0 0-.91-1.94C4.24 15.32 2 12.84 2 9Z"/>
//         </svg>`;

//       mdeRef.current = new EasyMDE({
//         element: editorRef.current,
//         initialValue: value,
//         autoDownloadFontAwesome: false,
//         renderingConfig: {
//           singleLineBreaks: false,
//           codeSyntaxHighlighting: true,
//         },
//         toolbar: [
//           "bold",
//           "italic",
//           "heading",
//           "|",
//           {
//             name: "flame",
//             action: function (editor) {
//               const cm = editor.codemirror;
//               cm.replaceSelection("🔥 Flame Lucide icon clicked!\n");
//             },
//             className: "custom-flame-icon",
//             title: "Insert Flame 🔥",
//           },
//           {
//             name: "save",
//             action: function (editor) {
//               const cm = editor.codemirror;
//               cm.replaceSelection("💾 Save icon clicked!\n");
//             },
//             className: "custom-save-icon",
//             title: "Save",
//           },
//           {
//             name: "idea",
//             action: function (editor) {
//               const cm = editor.codemirror;
//               cm.replaceSelection("💡 Idea icon clicked!\n");
//             },
//             className: "custom-idea-icon",
//             title: "Idea",
//           },
//           "|",
//           "preview",
//           "side-by-side",
//           "fullscreen",
//         ],
//       });

//       // Inject SVG icons vào nút tương ứng
//       setTimeout(() => {
//         const injectIcon = (selector: string, svg: string) => {
//           const btn = document.querySelector(selector) as HTMLElement;
//           if (btn) btn.innerHTML = svg;
//         };
//         injectIcon(".editor-toolbar .custom-flame-icon", flameIconSvg);
//         injectIcon(".editor-toolbar .custom-save-icon", saveIconSvg);
//         injectIcon(".editor-toolbar .custom-idea-icon", ideaIconSvg);
//       }, 0);

//       mdeRef.current.codemirror.on("change", () => {
//         const currentValue = mdeRef.current?.value();
//         if (currentValue !== undefined) {
//           onChange(currentValue);
//         }
//       });
//     }

//     return () => {
//       if (mdeRef.current) {
//         mdeRef.current.cleanup();
//       }
//     };
//   }, [isClient, value, onChange]);

//   if (!isClient) return <textarea ref={editorRef} />;
//   return <textarea ref={editorRef} />;
// };

// export default EasyMDEEditor;
