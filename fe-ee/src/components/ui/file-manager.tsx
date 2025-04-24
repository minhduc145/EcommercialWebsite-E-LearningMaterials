"use client"

import * as React from "react"
import { File, FileText, Folder, FolderPlus, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

// Simple data types
interface FileType {
  id: string
  name: string
  type: string
  dateCreated: string
  author: string
}

interface FolderType {
  id: string
  name: string
  files: FileType[]
}

// Initial data
const initialFolders: FolderType[] = [
  {
    id: "1",
    name: "Bài giảng E-Learning",
    files: [
      {
        id: "f1",
        name: "Bài giảng Unit 7: Television - Lesson 2",
        type: "scorm",
        dateCreated: "15:25:6 10/03/2024",
        author: "tthong.hp.qti",
      },
      {
        id: "f2",
        name: "Video hướng dẫn sử dụng",
        type: "mp4",
        dateCreated: "15:41:7 10/03/2024",
        author: "tthong.hp.qti",
      },
    ],
  },
  {
    id: "2",
    name: "Kế hoạch bài dạy",
    files: [
      {
        id: "f3",
        name: "Kế hoạch Unit 7: Television",
        type: "pdf",
        dateCreated: "14:30:0 09/03/2024",
        author: "tthong.hp.qti",
      },
    ],
  },
  {
    id: "3",
    name: "Video Thuyết minh",
    files: [
      {
        id: "f4",
        name: "Hướng dẫn sử dụng bài giảng",
        type: "mp4",
        dateCreated: "10:15:3 08/03/2024",
        author: "tthong.hp.qti",
      },
    ],
  },
]

export function FileExplorer() {
  const [folders, setFolders] = React.useState<FolderType[]>(initialFolders)
  const [selectedFolder, setSelectedFolder] = React.useState<FolderType>(initialFolders[0])
  const [newFolderName, setNewFolderName] = React.useState("")
  const [newFileName, setNewFileName] = React.useState("")
  const [newFileType, setNewFileType] = React.useState("scorm")
  const [isAddFolderOpen, setIsAddFolderOpen] = React.useState(false)
  const [isAddFileOpen, setIsAddFileOpen] = React.useState(false)

  // Add a new folder
  const addFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      files: [],
    }

    setFolders([...folders, newFolder])
    setNewFolderName("")
    setIsAddFolderOpen(false)
  }

  // Add a new file to the selected folder
  const addFile = () => {
    if (!newFileName.trim()) return

    const newFile = {
      id: Date.now().toString(),
      name: newFileName,
      type: newFileType,
      dateCreated: new Date().toLocaleString(),
      author: "current.user",
    }

    const updatedFolders = folders.map((folder) => {
      if (folder.id === selectedFolder.id) {
        return { ...folder, files: [...folder.files, newFile] }
      }
      return folder
    })

    setFolders(updatedFolders)
    setSelectedFolder(updatedFolders.find((f) => f.id === selectedFolder.id)!)
    setNewFileName("")
    setIsAddFileOpen(false)
  }

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "mp4":
        return <File className="h-5 w-5 text-purple-500" />
      case "scorm":
        return <File className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex border rounded-md h-[600px]">
      {/* Folders panel */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium">Các thư mục</h3>
          <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thư mục mới</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="folder-name">Tên thư mục</Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nhập tên thư mục"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFolderOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={addFolder}>Tạo mới</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100",
                  selectedFolder.id === folder.id && "bg-gray-100 font-medium",
                )}
                onClick={() => setSelectedFolder(folder)}
              >
                <Folder className="h-4 w-4 text-blue-600 mr-2" />
                <span className="truncate">{folder.name}</span>
                <span className="ml-auto text-xs text-gray-500">{folder.files.length}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Files panel */}
      <div className="w-2/3 flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium">{selectedFolder.name}</h3>
          <Dialog open={isAddFileOpen} onOpenChange={setIsAddFileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FilePlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm tệp tin mới</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="file-name">Tên tệp tin</Label>
                  <Input
                    id="file-name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Nhập tên tệp tin"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Loại tệp tin</Label>
                  <RadioGroup value={newFileType} onValueChange={setNewFileType} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scorm" id="scorm" />
                      <Label htmlFor="scorm">SCORM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf">PDF</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mp4" id="mp4" />
                      <Label htmlFor="mp4">Video (MP4)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFileOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={addFile}>Tạo mới</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          {selectedFolder.files.length > 0 ? (
            <div className="p-4 space-y-2">
              {selectedFolder.files.map((file) => (
                <div key={file.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                  {getFileIcon(file.type)}
                  <div className="ml-3">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      Ngày tạo: {file.dateCreated} • Người tạo: {file.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Không có tệp tin nào trong thư mục này
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
