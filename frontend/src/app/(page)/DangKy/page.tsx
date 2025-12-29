import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { Sign, RSign } from '@/components/features/sign';

export default function Home() {
  return (

    <main className="bg-[#004576] h-screen flex items-center justify-center p-10">
      <title>Register</title>
      <div className="grid w-full h-full grid-cols-1 bg-white box-anim lg:grid-cols-2">
        <div className="bg-white text-black flex items-center justify-center flex-col">
          <Link href="/" className="absolute top-20 left-20">
            <FaArrowLeft size={30} />
          </Link>
          <div><Sign /></div>
        </div>
        <div className="relative hidden lg:block">
          <div><RSign /></div>
        </div>
      </div>
    </main>
  );
}