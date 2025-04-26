import { clsx, type ClassValue } from "clsx"
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