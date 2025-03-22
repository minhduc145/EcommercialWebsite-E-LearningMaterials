'use client'
import Image from 'next/image'
import Logo from '@/app/logo.svg'


export default function Signup() {
    return (
        <div className="relative max-w-4xl max-sm:max-w-lg mx-auto font-[sans-serif] p-6">
            <div className="absolute top-5 left-5">
                <a href={'/'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap ="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </a>
            </div>

            <div className="text-center mb-12 sm:mb-16">
                <a href={"/"}><Image
                    src={Logo} alt="logo" className='w-25 inline-block' />
                </a>
                <h4 className="text-gray-600 text-base mt-6">Sign up into your account</h4>
            </div>

            <form action="Signup" method="POST">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">First Name</label>
                        <input name="name" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter name" />
                    </div>
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">Last Name</label>
                        <input name="lname" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter last name" />
                    </div>
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">Email Id</label>
                        <input name="email" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter email" />
                    </div>
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">Mobile No.</label>
                        <input name="number" type="number" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter mobile number" />
                    </div>
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">Password</label>
                        <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" />
                    </div>
                    <div>
                        <label className="text-gray-600 text-sm mb-2 block">Confirm Password</label>
                        <input name="cpassword" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter confirm password" />
                    </div>
                </div>

                <div className="mt-8">
                    <button type="button" className="mx-auto block py-3 px-6 text-sm tracking-wider rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}