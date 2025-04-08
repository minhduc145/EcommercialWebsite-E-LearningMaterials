'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function Logout() {
    const router = useRouter();
    useEffect(function(){
        fetch('http://localhost:8080/api/accounts/logout', {
            method: 'GET',
            credentials: 'include'
        }).then(() => {
            router.replace('http://localhost:3000');
        }).catch(() => {
            router.replace('http://localhost:3000');
        });
    },[])
}