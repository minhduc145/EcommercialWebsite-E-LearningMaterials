'use client'
import dynamic from 'next/dynamic';

const AppFooter = dynamic(() => import('@/components/footer'), { ssr: false });
const Header = dynamic(() => import('@/components/header'), { ssr: false });
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function Home() {
	return (
		<div className='bg-gradient-to-b from-blue-50 to-white'>
			<Header color='' />
			<br></br>
				<div className="min-h-[85dvh] m-auto container  gap-8 items-center justify-center flex flex-col-reverse md:flex-row px-5 md:px-0">
					<div className="flex flex-col gap-4">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 bg-clip-text text-transparent leading-18">
							<p>Nâng cấp kỹ năng cùng</p> 
							<p>e-Edu</p>
						</h1>
						<p className="text-lg text-gray-600 max-w-[600px]">
							Truy cập các khóa học chất lượng cao mọi lúc, mọi nơi.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<Button size="lg" className="bg-orange-500 hover:bg-orange-600 hover:cursor-pointer">
								<Link href={"/Courses"}>Khám phá ngay!</Link>
							</Button>
						</div>
						<p className="text-sm text-gray-600">
							<span className="font-bold text-blue-700">10,000+</span> học viên.
						</p>
					</div>
					<Image
						src="/global_imgs/homepage-img.png"
						alt="E-learning"
						className='max-w-[80dvw] max-h-[80dvh] w-auto'
						width={600} height={600}
					/>
				</div>
			<AppFooter />
		</div>
	)
}
