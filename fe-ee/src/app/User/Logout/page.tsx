'use client'
import { link_logout } from '@/lib/public-var'
export default function Logout() {
    localStorage.removeItem('currentUser')
    location.href = link_logout;
}