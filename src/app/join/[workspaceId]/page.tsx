"use client";

import Image from "next/image";

const JoinScreen = () => {
    return ( 
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
            <Image src="/logo.svg" width={60} height={60} alt="Logo" />
        </div>
     );
}
 
export default JoinScreen;