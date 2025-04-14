"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronRight, MoreHorizontal, Plus, Upload } from "lucide-react"

// Mock data
const initialFolders = [
  { id: 1, name: "Documents", path: "/" },
  { id: 2, name: "Images", path: "/" },
  { id: 3, name: "Downloads", path: "/" },
  { id: 4, name: "Reports", path: "/Documents" },
]

const initialFiles = [
  { id: 1, name: "Report.pdf", size: "2.4 MB", path: "/Documents" },
  { id: 2, name: "Budget.xlsx", size: "1.8 MB", path: "/Documents" },
  { id: 3, name: "Profile.jpg", size: "3.2 MB", path: "/Images" },
  { id: 4, name: "Project.zip", size: "15.7 MB", path: "/Downloads" },
]

export default function StretchingFileManager() {
  const [currentPath, setCurrentPath] = useState("/")
  const [newFolderDialog, setNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [folders, setFolders] = useState(initialFolders)
  const [files, setFiles] = useState(initialFiles)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter items based on current path
  const currentFolders = folders.filter((f) => f.path === currentPath)
  const currentFiles = files.filter((f) => f.path === currentPath)

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    if (currentPath === "/") return [{ name: "Upload", path: "/" }]

    const paths = currentPath.split("/").filter(Boolean)
    const breadcrumbs = [{ name: "Upload", path: "/" }]

    let buildPath = ""
    paths.forEach((path) => {
      buildPath += `/${path}`
      breadcrumbs.push({ name: path, path: buildPath })
    })

    return breadcrumbs
  }

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    setFolders([
      ...folders,
      {
        id: folders.length + 1,
        name: newFolderName,
        path: currentPath,
      },
    ])

    setNewFolderName("")
    setNewFolderDialog(false)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles?.length) return

    const newFiles = Array.from(uploadedFiles).map((file, index) => ({
      id: files.length + index + 1,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      path: currentPath,
    }))

    setFiles([...files, ...newFiles])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Navigate to folder
  const navigateToFolder = (folderName: string) => {
    setCurrentPath(`${currentPath === "/" ? "" : currentPath}/${folderName}`)
  }

  return (
    <div className="flex flex-col h-full w-full border rounded-md">
      {/* Header */}
      <div className="border-b p-3 flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-1 text-sm overflow-x-auto">
          {getBreadcrumbs().map((crumb, i) => (
            <div key={i} className="flex items-center whitespace-nowrap">
              {i > 0 && <ChevronRight className="h-3 w-3 mx-1 opacity-50 flex-shrink-0" />}
              <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentPath(crumb.path)}>
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-3 w-3 mr-1" /> Upload
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
          <Button size="sm" onClick={() => setNewFolderDialog(true)}>
            <Plus className="h-3 w-3 mr-1" /> Folder
          </Button>
        </div>
      </div>

      {/* Contents */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/20">
              <th className="text-left py-2 px-4 font-medium">Name</th>
              <th className="text-right py-2 px-4 font-medium w-[100px]">Size</th>
              <th className="w-[50px] px-2"></th>
            </tr>
          </thead>
          <tbody>
            {/* Folders */}
            {currentFolders.map((folder) => (
              <tr
                key={`folder-${folder.id}`}
                className="border-b hover:bg-muted/30 cursor-pointer"
                onClick={() => navigateToFolder(folder.name)}
              >
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <span className="font-medium">📁 {folder.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right text-muted-foreground">—</td>
                <td className="py-2 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}

            {/* Files */}
            {currentFiles.map((file) => (
              <tr key={`file-${file.id}`} className="border-b hover:bg-muted/30">
                <td className="py-2 px-4 truncate max-w-0 w-full">
                  <div className="flex items-center">
                    <span className="truncate">📄 {file.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right text-muted-foreground whitespace-nowrap">{file.size}</td>
                <td className="py-2 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {currentFolders.length === 0 && currentFiles.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  <p>This folder is empty</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Upload Files
                    </Button>
                    <Button size="sm" onClick={() => setNewFolderDialog(true)}>
                      New Folder
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New folder dialog */}
      <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <Input placeholder="Folder name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
