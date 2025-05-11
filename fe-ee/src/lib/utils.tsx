import { clsx, type ClassValue } from "clsx"
import { Code, File, FileArchive, FileAudio, FileAudio2, FileAudio2Icon, FileBox, FileImage, FileText, FileVideo2, FileVideoIcon, Film, Link } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (isoString: string): string => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(isoString));
};

export const formatDateTime = (isoString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};
//cache
const CACHE_NAME = 'my-app-cache-v1';

export async function putToCache(request: string | Request, response: Response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

export async function getFromCache(request: string | Request): Promise<Response | undefined> {
  const cache = await caches.open(CACHE_NAME);
  const match = await cache.match(request);
  return match || undefined;
}

export async function deleteFromCache(request: string | Request) {
  const cache = await caches.open(CACHE_NAME);
  await cache.delete(request);
}

export function getFileExtension(filename: string | undefined): string {
  return filename && filename.split('.').pop()?.toLowerCase() || '';
}


export function GetFileIcon({ type, hasColor = false }: { type: string, hasColor?: boolean }) {
  switch (type) {
    case "document":
      return <FileText className={`h-5 w-5  ${hasColor && 'text-red-500'}`} />
    case "media-image":
      return <FileImage className={`h-5 w-5  ${hasColor && 'text-purple-500'}`} />
    case "media-audio":
      return <FileAudio className={`h-5 w-5  ${hasColor && 'text-purple-500'}`} />
    case "media-hls":
      return <Film className={`h-5 w-5  ${hasColor && 'text-purple-500'}`} />
    case "media-video":
      return <Film className={`h-5 w-5  ${hasColor && 'text-purple-500'}`} />
    case "scorm":
      return <FileBox className={`h-5 w-5  ${hasColor && 'text-blue-500'}`} />
    case "link":
      return <Link className={`h-5 w-5  ${hasColor && 'text-green-500'}`} />
    case "iframe":
      return <Code className={`h-5 w-5  ${hasColor && 'text-orange-500'}`} />
    default:
      return <File className={`h-5 w-5  ${hasColor && 'text-gray-500'}`} />
  }
}


export function GetFileTypeName(type: string ): string {
  switch (type) {
    case "document":
      return "Tài liệu"
    case "media-image":
      return "Ảnh"
    case "media-audio":
      return "Âm thanh"
    case "media-hls":
      return "Video"
    case "media-video":
      return "Video"
    case "scorm":
      return "Tương tác - SCORM"
    case "link":
      return "Đường dẫn"
    case "iframe":
      return "Nhúng"
    default:
      return "<không xác định>"
  }
}