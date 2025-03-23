'use client'
import Header from '../components/header'
import Footer from '../components/footer'
import Image from "next/image";
import BannerImg from '../assets/dummy-slide-min.png'
import '@/app/assets/css/products/products.css'



export default function Main() {
    return (
        <>
            <Header color="blue" />
            <div className="banner h-96 bg-blue-900 rounded-bl-3xl rounded-br-3xl bg-left">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div>hi</div>
                    <div className="s2-col">
                        <Image className='' width='570' src={BannerImg} alt=""/>
                    </div>
                </div>

            </div>
            <main>
                <div className="container mx-auto px-4">

                </div>
            </main>
            <br />
            <Footer />

        </>
    )
}