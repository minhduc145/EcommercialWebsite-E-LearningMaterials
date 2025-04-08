'use client'

import dynamic from 'next/dynamic'

const AppFooter = dynamic(() => import('@/components/footer'), { ssr: false })

export default function ClientHeaderWrapper() {
  return <AppFooter />
}
