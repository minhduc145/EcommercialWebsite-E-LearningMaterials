"use client"

import { useState } from "react"
import { Combine, File, FileText, SquarePlay } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Types
type FileType = "video" | "document" | "scorm"

interface File {
  id: string
  name: string
  type: FileType
}

interface Folder {
  id: string
  name: string
  files: File[]
}

// File Icon Component
function FileIcon({ type }: { type: FileType }) {
  switch (type) {
    case "video":
      return (
        <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-md text-white">
          <SquarePlay className="size-4" />
        </div>
      )
    case "document":
      return (
        <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-md text-white">
          <FileText className="size-4" />
        </div>
      )
    case "scorm":
      return (
        <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-md text-white">
          <Combine className="size-5" />
        </div>
      )
  }
}

// File Accordion Component
function FileAccordion() {
  const [folders] = useState<Folder[]>([
    {
      id: "folder-1",
      name: "Bài giảng E-Learning Scorm",
      files: [
        {
          id: "file-1",
          name: "Bài giảng E-Learning Unit 7:Television - Lesson 2 : A Closer Look 1",
          type: "scorm",
        },
        {
          id: "file-2",
          name: "Video Thuyết minh, hướng dẫn sử dụng bài giảng E-Learning Unit 7: Television - Lesson 2: A Closer Look 1",
          type: "video",
        },
        {
          id: "file-3",
          name: "Kế hoạch bài dạy Unit 7: Television - Lesson 2: A Closer Look 1",
          type: "document",
        },
      ],
    },
    {
      id: "folder-2",
      name: "Kế hoạch bài dạy",
      files: [
        {
          id: "file-4",
          name: "Kế hoạch bài dạy Unit 8: Television - Lesson 1",
          type: "document",
        },
      ],
    },
    {
      id: "folder-3",
      name: "Video Thuyết minh, hướng dẫn sử dụng bài giảng",
      files: [
        {
          id: "file-5",
          name: "Video hướng dẫn sử dụng E-Learning",
          type: "video",
        },
      ],
    },
  ]
  )

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {folders?.map((folder) => (
        <AccordionItem key={folder.id} value={folder.id} className="border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <div className="font-medium text-md md:text-lg">{folder.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <File className="hidden size-2 md:inline" />
                  <span className="font-normal">{folder.files.length} tài liệu</span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 px-0">
            <div className="divide-y">
              {folder?.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex-shrink-0">
                    <FileIcon type={file.type} />
                  </div>
                  <div className="font-medium">{file.name}</div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// Main Page Component
export default function CourseFileAccordion() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto">
        <FileAccordion />
      </div>
    </div>
  )
}
