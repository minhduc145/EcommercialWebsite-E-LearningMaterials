'use client'
import { redirect } from 'next/navigation'
export default function Logout() {
    fetch('http://localhost:8080/api/accounts/logout', {
        method: 'GET',
        credentials: 'include'
    }).then(() => {
        redirect('/') 
    }).catch(() => {
        redirect('/') 
    });

}