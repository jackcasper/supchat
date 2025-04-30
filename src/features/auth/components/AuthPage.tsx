"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInSection } from "./SignInSection";
import { SignUpSection } from "./SignUpSection";

export const AuthPage = () => {
    const [state, setState] = useState<SignInFlow>("signIn");
    return (
        <div className="h-full flex items-center justify-center bg-[#3D2683]">
            <div className="md:h-auto md:w-[420px]">
                {state === "signIn" ? <SignInSection setState={setState} /> : <SignUpSection setState={setState} />}
            </div>
        </div>
    );
};