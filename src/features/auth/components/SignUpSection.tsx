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
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import clsx from "clsx";

interface SignUpSectionProps {
    setState: (state: SignInFlow) => void;
};

const getPasswordStrength = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const score = [hasLength, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

    return {
        hasLength,
        hasUpper,
        hasNumber,
        hasSymbol,
        score,
    };
};

export const SignUpSection = ({ setState }: SignUpSectionProps) => {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const strength = getPasswordStrength(password);

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Your passwords don't match. Please try again.");
            return;
        }

        setPending(true);
        signIn("password", { name, email, password, flow: "signUp" })
            .catch(() => {
                setError("An unexpected error occurred. Please try again.");
            })
            .finally(() => {
                setPending(false);
            })
    };

    const onProviderSignUp = (value: "google") => {
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
                    Sign up to Supchat
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
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                    <Input
                        disabled={pending}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        required
                    />
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

                    <div className="space-y-1">
                        <div className="flex h-2 overflow-hidden rounded bg-muted">
                            <div
                                className={clsx("transitiona-all duration-300 h-full", {
                                    "w-1/4 bg-red-500": strength.score === 1,
                                    "w-2/4 bg-yellow-500": strength.score === 2,
                                    "w-3/4 bg-blue-500": strength.score === 3,
                                    "w-full bg-green-500": strength.score === 4,
                                    "w-[2px] bg-transparent": strength.score === 0,
                                })}
                            />
                        </div>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <li className={strength.hasLength ? "text-green-500" : ""}>
                                At least 8 characters
                            </li>
                            <li className={strength.hasUpper ? "text-green-500" : ""}>
                                Contains uppercase letter
                            </li>
                            <li className={strength.hasUpper ? "text-green-500" : ""}>
                                Contains number
                            </li>
                            <li className={strength.hasUpper ? "text-green-500" : ""}>
                                Contains symbol
                            </li>
                        </ul>
                    </div>
                    <Input
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
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
                        onClick={() => onProviderSignUp("google")}
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