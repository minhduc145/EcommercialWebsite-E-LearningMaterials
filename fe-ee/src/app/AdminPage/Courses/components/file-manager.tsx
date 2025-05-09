"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Folder, FolderPlus, FilePlus, MoreHorizontal, Link, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDateTime, getFileExtension } from "@/lib/utils"
import type { CourseContainerModel } from "@/models/CourseContainerModel"
import type { CourseFileModel } from "@/models/CourseFileModel"
import JSZip from "jszip"
import { FileText, FileVideoIcon, FileArchive, File, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import {
  addContainer,
  addFile,
  deleteContainer,
  deleteFile,
  getCourseData,
  getCourseDataWithUrl,
  getSignedUrl,
  uploadFileToSignedUrl,
} from "@/app/api/api-courses"

export const getFileIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "document":
      return <FileText className="h-5 w-5 text-red-500" />
    case "media":
      return <FileVideoIcon className="h-5 w-5 text-purple-500" />
    case "hls":
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

// Interface for uploading file
export interface UploadingFile {
  id: string
  name: string
  type: string
  progress: number
  folderId: string
}

const courseId = "1"
const FileType = [
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
]

const myUploadMap = new Map<string, AbortController>()

export function FileExplorer() {
  const [resetKey, setResetKey] = useState(false)
  // State management
  const [folders, setFolders] = useState<CourseContainerModel[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  // Form state
  const [newFolderName, setNewFolderName] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isScormModalOpen, setIsScormModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<CourseContainerModel | null>(null)
  const [editingFile, setEditingFile] = useState<CourseFileModel | null>(null)

  // Upload state
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])

  const [linkUrl, setLinkUrl] = useState("")
  const [iframeCode, setIframeCode] = useState("")

  useEffect(() => {
    getCourseDataWithUrl(courseId).then((res) => setFolders(res.data))
  }, [resetKey])

  const openFolderModal = (folder: CourseContainerModel | null = null, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingFolder(folder)
    setNewFolderName(folder?.name || "")
    setIsFolderModalOpen(true)
  }

  const openMediaModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setIsMediaModalOpen(true)
  }

  const openScormModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setIsScormModalOpen(true)
  }

  const openDocumentModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setIsDocumentModalOpen(true)
  }

  // Update the openLinkModal function to set the linkUrl when editing
  const openLinkModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setLinkUrl(file?.url || "")
    setIsLinkModalOpen(true)
  }

  // Update the openIframeModal function to set the iframeCode when editing
  const openIframeModal = (file: CourseFileModel | null = null) => {
    setEditingFile(file)
    setNewFileName(file?.name || "")
    setIframeCode(file?.url || "")
    setIsIframeModalOpen(true)
  }

  const handleFileChange = async (file: any) => {
    if (!file) return
    const fileType = file.type
    if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("compressed")) {
      const zip = new JSZip()
      try {
        const zipData = await zip.loadAsync(file, { createFolders: false })
        const fileNames = Object.keys(zipData.files).map((name) => name.toLowerCase())
        const hasManifest = fileNames.includes("imsmanifest.xml") || fileNames.includes("./imsmanifest.xml")
        console.log(hasManifest)
      } catch (err) {
        console.error("Lỗi khi đọc file zip:", err)
      } finally {
      }
    }
  }

  const handleSaveFolder = () => {
    var container: CourseContainerModel
    if (!newFolderName.trim()) return
    if (editingFolder) {
      editingFolder.name = newFolderName
      container = editingFolder
    } else {
      const newFolder = {
        id: "",
        name: newFolderName,
        createdAt: new Date().toISOString(),
        files: [],
      }
      container = newFolder
    }
    setIsFolderModalOpen(false)
    setEditingFolder(null)
    setNewFolderName("")
    addContainer(courseId, container).then(() => {
      setResetKey(!resetKey)
    })
  }

  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteContainer(folderId).then(() => setResetKey(!resetKey))
    if (selectedIndex >= 0 && folders[selectedIndex]?.id === folderId) {
      if (folders.length > 0) {
        setSelectedIndex(0)
      } else {
        setSelectedIndex(-1)
      }
    }
  }

  const handleSaveFile = async (fileType = "document") => {
    if (selectedIndex < 0 || !newFileName.trim()) return
    const folderId = folders[selectedIndex]?.id
    const file = fileInputRef.current?.files?.[0]

    if (editingFile) {
      editingFile.name = newFileName
      addFile(folderId, editingFile).then(() => setResetKey(!resetKey))
      setIsMediaModalOpen(false)
      setIsScormModalOpen(false)
      setIsDocumentModalOpen(false)
      setEditingFile(null)
      setNewFileName("")
      return
    }

    if (!file) return
    const fileId = uuidv4()

    // Close the appropriate modal
    setIsMediaModalOpen(false)
    setIsScormModalOpen(false)
    setIsDocumentModalOpen(false)

    const newFile: CourseFileModel = {
      id: fileId,
      name: newFileName,
      type: fileType,
      createdAt: new Date().toISOString(),
      extension: getFileExtension(file.name),
      authorId: "current.user",
      url: "",
    }

    const newUploadingFile: UploadingFile = {
      id: fileId,
      name: newFile.name,
      type: fileType,
      progress: 0,
      folderId: folderId,
    }

    setUploadingFiles((prev) => [...prev, newUploadingFile])
    const fileKey = `${folderId}/${fileId}.${getFileExtension(file.name)}`
    const res = await getSignedUrl(fileKey)
    const signedUrl = res?.data

    if (signedUrl) {
      const controller = new AbortController()
      myUploadMap.set(fileId, controller)
      uploadFileToSignedUrl(
        file,
        signedUrl,
        (percent) => {
          setUploadingFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: percent } : f)))
        },
        controller.signal,
      ).then(() => {
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
        }, 1000)
        addFile(folderId, newFile).then(() => setResetKey(!resetKey))
      })
    }
  }

  // Update the handleSaveLink function to handle editing
  const handleSaveLink = async () => {
    if (selectedIndex < 0 || !newFileName.trim() || !linkUrl.trim()) return
    const folderId = folders[selectedIndex]?.id

    if (editingFile) {
      editingFile.name = newFileName
      editingFile.url = linkUrl
      addFile(folderId, editingFile).then(() => setResetKey(!resetKey))
      setIsLinkModalOpen(false)
      setEditingFile(null)
      setNewFileName("")
      setLinkUrl("")
      return
    }

    const fileId = uuidv4()
    setIsLinkModalOpen(false)

    const newFile: CourseFileModel = {
      id: fileId,
      name: newFileName,
      type: "link",
      createdAt: new Date().toISOString(),
      extension: "url",
      authorId: "current.user",
      url: linkUrl,
    }

    addFile(folderId, newFile).then(() => {
      setResetKey(!resetKey)
      setNewFileName("")
      setLinkUrl("")
    })
  }

  // Update the handleSaveIframe function to handle editing
  const handleSaveIframe = async () => {
    if (selectedIndex < 0 || !newFileName.trim() || !iframeCode.trim()) return
    const folderId = folders[selectedIndex]?.id

    if (editingFile) {
      editingFile.name = newFileName
      editingFile.url = iframeCode
      addFile(folderId, editingFile).then(() => setResetKey(!resetKey))
      setIsIframeModalOpen(false)
      setEditingFile(null)
      setNewFileName("")
      setIframeCode("")
      return
    }

    const fileId = uuidv4()
    setIsIframeModalOpen(false)

    const newFile: CourseFileModel = {
      id: fileId,
      name: newFileName,
      type: "iframe",
      createdAt: new Date().toISOString(),
      extension: "html",
      authorId: "current.user",
      url: iframeCode,
    }

    addFile(folderId, newFile).then(() => {
      setResetKey(!resetKey)
      setNewFileName("")
      setIframeCode("")
    })
  }

  const handleDeleteFile = (fileId: string) => {
    if (selectedIndex < 0) return
    deleteFile(fileId).then(() => setResetKey(!resetKey))
  }

  const cancelUpload = (uploadId: string) => {
    myUploadMap.get(uploadId)?.abort()
    setUploadingFiles((prev) => prev.filter((file) => file.id !== uploadId))
  }

  return (
    <>
      <div className="flex border rounded-md h-[600px] relative">
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Thư mục</h3>
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
                          onClick={(e) => handleDeleteFolder(folder.id, e)}
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

        <div className="w-2/3 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">
              {selectedIndex >= 0 ? folders[selectedIndex]?.name : "Không có thư mục được chọn"}
            </h3>
            {selectedIndex >= 0 && (
              <Popover>
                <PopoverTrigger>
                  <FilePlus className="h-4 w-4 hover:cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="flex flex-col w-auto px-2 py-1">
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openMediaModal()}>
                    📺 Thêm file Đa phương tiện
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openScormModal()}>
                    💾 Thêm file SCORM
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-sm px-2 py-1 justify-start"
                    onClick={() => openDocumentModal()}
                  >
                    📄 Thêm file Tài liệu
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openLinkModal()}>
                    🔗 Thêm Đường dẫn
                  </Button>
                  <Button variant="ghost" className="text-sm px-2 py-1 justify-start" onClick={() => openIframeModal()}>
                    📜 Thêm nhúng iframe
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <ScrollArea className="flex-1 max-h-[90%]">
            {selectedIndex < 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">Vui lòng chọn một thư mục</div>
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
                            onClick={() => {
                              switch (file.type) {
                                case "media":
                                  openMediaModal(file)
                                  break
                                case "scorm":
                                  openScormModal(file)
                                  break
                                case "document":
                                  openDocumentModal(file)
                                  break
                                case "link":
                                  openLinkModal(file)
                                  break
                                case "iframe":
                                  openIframeModal(file)
                                  break
                                default:
                                  openMediaModal(file)
                              }
                            }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start h-9 text-red-500"
                            onClick={() => handleDeleteFile(file.id)}
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
              <div className="flex items-center justify-center h-full text-gray-500">Không có tệp tin</div>
            )}
          </ScrollArea>
        </div>

        {/*Folder Modal*/}
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
              <Button onClick={handleSaveFolder}>{editingFolder ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Media File Modal */}
        <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa tệp tin" : "Thêm file Đa phương tiện"}</DialogTitle>
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
                      accept="video/*,audio/*,image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        e && handleFileChange(e.target.files?.[0])
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Chấp nhận: video, audio, hình ảnh</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMediaModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveFile("media")}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SCORM File Modal */}
        <Dialog open={isScormModalOpen} onOpenChange={setIsScormModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa tệp tin" : "Thêm file SCORM"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="scorm-file-name">Tên tệp tin</Label>
                <Input
                  id="scorm-file-name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Nhập tên tệp tin"
                  className="mt-2"
                />
              </div>
              {!editingFile && (
                <div>
                  <Label htmlFor="scorm-file-input">Tải lên tệp</Label>
                  <div className="mt-2">
                    <Input
                      id="scorm-file-input"
                      type="file"
                      accept=".zip"
                      ref={fileInputRef}
                      onChange={(e) => {
                        e && handleFileChange(e.target.files?.[0])
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Chỉ chấp nhận file .zip</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScormModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveFile("scorm")}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document File Modal */}
        <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa tệp tin" : "Thêm file Tài liệu"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="document-file-name">Tên tệp tin</Label>
                <Input
                  id="document-file-name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Nhập tên tệp tin"
                  className="mt-2"
                />
              </div>
              {!editingFile && (
                <div>
                  <Label htmlFor="document-file-input">Tải lên tệp</Label>
                  <div className="mt-2">
                    <Input
                      id="document-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      ref={fileInputRef}
                      onChange={(e) => {
                        e && handleFileChange(e.target.files?.[0])
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Chấp nhận: PDF, Word, PowerPoint, Excel, Text</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveFile("document")}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Link Modal */}
        <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa đường dẫn" : "Thêm Đường dẫn"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="link-name">Tên đường dẫn</Label>
                <Input
                  id="link-name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Nhập tên đường dẫn"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveLink()}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Iframe Modal */}
        <Dialog open={isIframeModalOpen} onOpenChange={setIsIframeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? "Chỉnh sửa iframe" : "Thêm nhúng iframe"}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="iframe-name">Tên iframe</Label>
                <Input
                  id="iframe-name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Nhập tên iframe"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="iframe-code">Mã nhúng iframe</Label>
                <textarea
                  id="iframe-code"
                  value={iframeCode}
                  onChange={(e) => setIframeCode(e.target.value)}
                  placeholder="<iframe src='https://example.com' width='100%' height='400'></iframe>"
                  className="w-full min-h-[100px] p-2 border rounded-md mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsIframeModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => handleSaveIframe()}>{editingFile ? "Lưu" : "Tạo mới"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Status Dialog */}
        <UploadStatusDialog uploadingFiles={uploadingFiles} onCancelUpload={cancelUpload} />
      </div>
    </>
  )
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
