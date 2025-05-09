"use client"

import { Code, Combine, File, FileArchive, FileAudio2Icon, FileText, FileVideoIcon, Link, SquarePlay } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseContainerModel } from "@/models/CourseContainerModel"
interface IFileTypeProp {
  type: string
}

function FileIcon({ type }: IFileTypeProp) {
 switch (type) {
    case "document":
      return <FileText className="h-5 w-5 text-red-500" />
    case "media":
      return <FileAudio2Icon className="h-5 w-5 text-purple-500" />
    case "media-hls":
      return <FileVideoIcon className="h-5 w-5 text-purple-500" />
    case "scorm":
      return <FileArchive className="h-5 w-5 text-blue-500" />
    case "link":
      return <Link className="h-5 w-5 text-green-500" />
    case "iframe":
      return <Code className="h-5 w-5 text-orange-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
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
                <div>📁</div>
                <div className="font-medium text-md md:text-lg">{folder.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <File className="hidden size-3 md:inline" />
                    <span className="font-normal">{folder.files?.length ?? "0"} tài liệu</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 px-0">
              <div className="divide-y">
                {folder?.files && folder.files.length > 0 ? (
                  folder.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-5 px-10 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <FileIcon type={file.type} />
                      </div>
                      <div className="font-medium">{file.name}</div>
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-2"><i>Thư mục rỗng</i></p>
                )}

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
