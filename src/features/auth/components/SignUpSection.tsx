import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types";
import { useState } from "react";

interface SignUpSectionProps {
    setState: (state: SignInFlow) => void;
};

export const SignUpSection = ({ setState }: SignUpSectionProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign up to Supchat
                </CardTitle>
                <CardDescription>
                    Enter your Email or use another service
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                        disabled={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={false}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Input
                        disabled={false}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        type="password"
                        required
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={false}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-2.5">
                    <Button
                        disabled={false}
                        onClick={() => { }}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        <FcGoogle className="size-5"/>
                        Sign in with Google
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already using Supchat? <span onClick={() => setState("signIn")} className="text-sky-700 hover:underline cursor-pointer">Sign in</span>
                </p>
            </CardContent>
        </Card>
    );
};