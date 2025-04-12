'use client'

import dynamic from 'next/dynamic';

const AppFooter = dynamic(() => import('@/components/footer'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });
import axios from "axios";
import WebSocketMessage from '@/lib/stompClient';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

export default function Home() {
	return (
		<div className="bg-white">
			<Header color='' />
			<div className="relative isolate px-6 lg:px-8">
				<div className="mx-auto max-w-2xl py-32 sm:py-36 lg:py-44">
					<WebSocketMessage/>
					<div className="aspect-video w-full">
						<iframe allowFullScreen className="w-full h-full" src="https://archive.org/embed/CNNW_20250410_110000_CNN_News_Central?start=60&end=120"></iframe>
					</div>
				</div>
				<div aria-hidden="true"
					className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					/>
				</div>
			</div>
			<AppFooter />
		</div>
	)
}
