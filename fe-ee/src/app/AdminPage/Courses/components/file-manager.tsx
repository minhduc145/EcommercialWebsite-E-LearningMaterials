"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Folder, FolderPlus, FilePlus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDateTime } from "@/lib/utils"
import type { CourseContainerModel } from "@/models/CourseContainerModel"
import type { CourseFileModel } from "@/models/CourseFileModel"
import JSZip from "jszip"
import { FileText, FileVideoIcon, FileArchive, File } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

// Helper function to get file icon based on type
export const getFileIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "document":
      return <FileText className="h-5 w-5 text-red-500" />
    case "media":
      return <FileVideoIcon className="h-5 w-5 text-purple-500" />
    case "scorm":
      return <FileArchive className="h-5 w-5 text-blue-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}
interface PostObject {
  courseId: string | undefined
  container: CourseContainerModel | undefined
}
const courseId = "1"
const FileType = ([] = [
  {
    id: "scorm",
    name: "SCORM",
  },
  {
    id: "media",
    name: "Đa phương tiện",
  },
  {
    id: "document",
    name: "Tài liệu",
  },
])

export function FileExplorer() {
  const [isScorm, setIsScorm] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [resetKey, setResetKey] = useState(false)
  // State management
  const [folders, setFolders] = useState<CourseContainerModel[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  // Form state
  const [newFolderName, setNewFolderName] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [newFileType, setNewFileType] = useState("scorm")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<CourseContainerModel | null>(null)
  const [editingFile, setEditingFile] = useState<CourseFileModel | null>(null)

  // Upload state
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  useEffect(() => {
    getCourseData(courseId).then((res) => setFolders(res.data))
  }, [resetKey])

  const saveAllChange = () => {
    // const postObject: PostObject = {
    //   courseId: courseId,
    //   object: folders,
    // }
    // console.log(postObject)

  }

  const handleFileChange = async (file: any) => {
    if (!file) return
    setChecking(true)
    const zip = new JSZip()
    try {
      const zipData = await zip.loadAsync(file, { createFolders: false })
      const fileNames = Object.keys(zipData.files).map((name) => name.toLowerCase())
      const hasManifest = fileNames.includes("imsmanifest.xml") || fileNames.includes("./imsmanifest.xml")
      setIsScorm(hasManifest)
      console.log(hasManifest)
    } catch (err) {
      console.error("Lỗi khi đọc file zip:", err)
      setIsScorm(false)
    } finally {
      setChecking(false)
    }
  }

  // Folder operations
  const openFolderModal = (folder: CourseContainerModel | null = null, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingFolder(folder)
    setNewFolderName(folder?.name || "")
    setIsFolderModalOpen(true)
  }

  const saveFolder = () => {
    if (!newFolderName.trim()) return
    var container: CourseContainerModel;
    if (editingFolder) {
      container = editingFolder;
    } else {
      const newFolder = {
        id: "",
        name: newFolderName,
        createdAt: new Date().toISOString(),
        files: [],
      }
      container = newFolder;
    }

    setIsFolderModalOpen(false)
    setEditingFolder(null)
    setNewFolderName("")

    const postObject: PostObject = {
      courseId: courseId,
      container: container
    }

    addContainer(courseId, container).then(() => { setResetKey(!resetKey) })

  }

  const deleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedFolders = folders.filter((folder) => folder.id !== folderId)
    setFolders(updatedFolders)

    // If deleted folder was selected, select first available folder or set to -1 if no folders remain
    if (selectedIndex >= 0 && folders[selectedIndex]?.id === folderId) {
      if (updatedFolders.length > 0) {
        setSelectedIndex(0)
      } else {
        setSelectedIndex(-1)
      }
    }
  }

  // File operations
  const openFileModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setNewFileType(file?.type || "scorm")
    setIsFileModalOpen(true)
  }

  const saveFile = () => {
    if (!newFileName.trim() || selectedIndex < 0) return

    if (editingFile) {
      // Update existing file
      const updatedFolders = folders.map((folder) => {
        if (folder.id === folders[selectedIndex]?.id) {
          const updatedFiles = folder.files.map((file) =>
            file.id === editingFile.id ? { ...file, name: newFileName, type: newFileType } : file,
          )
          return { ...folder, files: updatedFiles }
        }
        return folder
      })
      setFolders(updatedFolders)
      // No need to update selectedIndex since we're using the index reference
      setIsFileModalOpen(false)
      setEditingFile(null)
      setNewFileName("")
    } else {
      // Close the modal first
      setIsFileModalOpen(false)

      // Create a new uploading file
      const uploadId = uuidv4()
      const newUploadingFile: UploadingFile = {
        id: uploadId,
        name: newFileName,
        type: newFileType,
        progress: 0,
        folderId: folders[selectedIndex]?.id,
      }

      // Add to uploading files
      setUploadingFiles((prev) => [...prev, newUploadingFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadingFiles((prev) => {
          // Find the file we're updating
          const fileToUpdate = prev.find((f) => f.id === uploadId)

          // If file doesn't exist anymore (was canceled), clear the interval
          if (!fileToUpdate) {
            clearInterval(interval)
            return prev
          }

          // Calculate new progress
          const newProgress = fileToUpdate.progress + 5

          // If upload is complete
          if (newProgress >= 100) {
            clearInterval(interval)

            // Add the file to the folder
            const newFile: CourseFileModel = {
              id: Date.now().toString(),
              name: fileToUpdate.name,
              type: fileToUpdate.type,
              createdAt: new Date().toISOString(),
              extension: "zip",
              authorId: "current.user",
              url: "",
            }

            // Update folders with the new file
            setFolders((folders) =>
              folders.map((folder) => {
                if (folder.id === fileToUpdate.folderId) {
                  return { ...folder, files: [...folder.files, newFile] }
                }
                return folder
              }),
            )

            // If this is the selected folder, update it
            // No need to update selectedIndex since we're using the index reference

            // Remove this file from uploading files
            return prev.filter((f) => f.id !== uploadId)
          }

          // Update progress for this file
          return prev.map((file) => (file.id === uploadId ? { ...file, progress: newProgress } : file))
        })
      }, 200)

      // Reset form
      setNewFileName("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const deleteFile = (fileId: string) => {
    if (selectedIndex < 0) return

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folders[selectedIndex]?.id) {
        return {
          ...folder,
          files: folder.files.filter((file) => file.id !== fileId),
        }
      }
      return folder
    })

    setFolders(updatedFolders)
    // No need to update selectedIndex since we're using the index reference
  }

  const cancelUpload = (uploadId: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== uploadId))
  }

  return (
    <>
      <div className="flex border rounded-md h-[600px] relative">
        {/* Folders panel */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">
              Thư mục
            </h3>
            <FolderPlus className="h-4 w-4 hover:cursor-pointer" onClick={() => openFolderModal()} />
          </div>

          <ScrollArea className="flex-1 max-h-[90%]">
            <div className="p-2">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100",
                    selectedIndex >= 0 && folders[selectedIndex]?.id === folder.id && "bg-gray-100 font-medium",
                  )}
                  onClick={() => setSelectedIndex(folders.indexOf(folder))}
                >
                  <Folder className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-xs text-gray-500 mr-2">{folder.files.length}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0" align="end">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start h-9"
                          onClick={(e) => openFolderModal(folder, e)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start h-9 text-red-500"
                          onClick={(e) => deleteFolder(folder.id, e)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Files panel */}
        <div className="w-2/3 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">
              {selectedIndex >= 0 ? folders[selectedIndex]?.name : "Không có thư mục được chọn"}
            </h3>
            {selectedIndex >= 0 && (
              <Popover>
                <PopoverTrigger>
                  <FilePlus className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="flex flex-col w-auto px-2 py-1">
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openFileModal()}>
                    📺 Thêm file Đa phương tiện
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openFileModal()}>
                    💾 Thêm file SCORM
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openFileModal()}>
                    📄 Thêm file Tài liệu
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openFileModal()}>
                    🔗 Thêm Đường dẫn
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openFileModal()}>
                    📜 Thêm nhúng iframe
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <ScrollArea className="flex-1 max-h-[90%]">
            {selectedIndex < 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Vui lòng chọn một thư mục
              </div>
            ) : folders[selectedIndex]?.files.length > 0 ? (
              <div className="p-4 space-y-2">
                {folders[selectedIndex]?.files.map((file) => (
                  <div key={file.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                    {getFileIcon(file.type)}
                    <div className="ml-3 flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        Ngày tạo: {formatDateTime(file.createdAt)} • Người tạo: {file.authorId}
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0" align="end">
                        <div className="flex flex-col">
                          <Button variant="ghost" size="sm" className="justify-start h-9">
                            Xem trước
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start h-9"
                            onClick={() => openFileModal(file)}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start h-9 text-red-500"
                            onClick={() => deleteFile(file.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Không có tệp tin
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Folder Modal */}
        <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFolder ? "Chỉnh sửa thư mục" : "Thêm thư mục mới"}</DialogTitle>
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
              <Button variant="outline" onClick={() => setIsFolderModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={saveFolder}>{editingFolder ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Modal */}
        <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa tệp tin" : "Thêm tệp tin mới"}</DialogTitle>
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
              {!editingFile && (
                <div>
                  <Label htmlFor="file-input">Tải lên tệp</Label>
                  <div className="mt-2">
                    <Input
                      id="file-input"
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        e && handleFileChange(e.target.files?.[0])
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFileModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={saveFile}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Use the extracted UploadStatusDialog component */}
        <UploadStatusDialog uploadingFiles={uploadingFiles} onCancelUpload={cancelUpload} />
      </div>
    </>
  )
}

import { X } from "lucide-react"
import { addContainer, getCourseData } from "@/app/api/api-courses"

// Interface for uploading file
export interface UploadingFile {
  id: string
  name: string
  type: string
  progress: number
  folderId: string
}

interface UploadStatusDialogProps {
  uploadingFiles: UploadingFile[]
  onCancelUpload: (uploadId: string) => void
}

export function UploadStatusDialog({ uploadingFiles, onCancelUpload }: UploadStatusDialogProps) {
  if (uploadingFiles.length === 0) return null

  return (
    <div className="fixed right-4 bottom-25 bg-white shadow-lg rounded-lg border p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-sm">Đang tải lên</h4>
        <span className="text-xs text-muted-foreground">{uploadingFiles.length} tệp</span>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {uploadingFiles.map((file) => (
          <div key={file.id} className="space-y-2">
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div className="text-sm truncate flex-1">{file.name}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCancelUpload(file.id)}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{file.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
