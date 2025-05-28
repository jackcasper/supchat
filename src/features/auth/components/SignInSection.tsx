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
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from 'lucide-react';

interface SignInSectionProps {
    setState: (state: SignInFlow) => void;
};

export const SignInSection = ({ setState }: SignInSectionProps) => {
    const { signIn } = useAuthActions();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPending(true);
        signIn("password", { email, password, flow: "signIn" })
            .catch(() => {
                setError("Invalid Email or Password");
            })
            .finally(() => {
                setPending(false);
            });
    };

    const onProviderSignIn = (value: "google") => {
        setPending(true);
        signIn(value)
            .finally(() => {
                setPending(false);
        })
    };
    
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign in to Supchat
                </CardTitle>
                <CardDescription>
                    Enter your Email or use another service
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignIn} className="space-y-2.5">
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Button type="submit" className="w-full" size="lg" disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-2.5">
                    <Button
                        disabled={pending}
                        onClick={() => onProviderSignIn("google")}
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                    >
                        <FcGoogle className="size-5"/>
                        Sign in with Google
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    New to Supchat? <span onClick={() => setState("signUp")} className="text-sky-700 hover:underline cursor-pointer">Create an account</span>
                </p>
            </CardContent>
        </Card>
    );
};