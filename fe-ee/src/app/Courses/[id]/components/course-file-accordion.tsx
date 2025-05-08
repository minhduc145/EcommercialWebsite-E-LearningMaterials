"use client"

import { Combine, File, FileText, SquarePlay } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseContainerModel } from "@/models/CourseContainerModel"
interface IFileTypeProp {
  type: string
}

function FileIcon({ type }: IFileTypeProp) {
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

interface IDataProp {
  course_data: CourseContainerModel[]
}

function FileAccordion({ course_data }: IDataProp) {
  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {course_data?.map((folder) => {
        return (
          < AccordionItem key={folder.id} value={folder.id} className="border rounded-md overflow-hidden" >
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
        )
      })}
    </Accordion >
  )
}

export default function CourseFileAccordion({ course_data }: IDataProp) {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto">
        <FileAccordion course_data={course_data ?? []} />
      </div>
    </div>
  )
}
