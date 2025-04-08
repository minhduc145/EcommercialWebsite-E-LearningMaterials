'use client'

import dynamic from 'next/dynamic'

interface IProp{
  color:string
}
const Header = dynamic(() => import('@/components/header'), { ssr: false })

export default function ClientHeaderWrapper(prop:IProp) {
  return <Header color={prop.color} />
}
