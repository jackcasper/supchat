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
import { TriangleAlert, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignInSectionProps {
    setState: (state: SignInFlow) => void;
};

export const SignInSection = ({ setState }: SignInSectionProps) => {
    const { signIn } = useAuthActions();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState<{ form?: boolean; google?: boolean}>({});
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending({ form: true });
        setError("");

        try {
            await signIn("password", { email, password, flow: "signIn" });
        } catch (err) {
            console.error("Sign in error:", err);
            setError(err instanceof Error ? err.message : "Invalid email or password");
        } finally {
            setPending({});
        }
    };

    const onProviderSignIn = async (value: "google") => {
        setPending({google: true});
        setError("");
        
        try {
            await signIn(value);
        } catch (err) {
            console.error("Google sign in error:", err);
            setError("Failed to sign in with Google");
        } finally {
            setPending({});
        }
    };
    
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Welcome back
                </CardTitle>
                <CardDescription>
                    Sign in to continue to Supchat
                </CardDescription>
            </CardHeader>

            {error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}

            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignIn} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            disabled={pending.form}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                            className="h-11"
                        />
                        <div className="relative">
                            <Input
                                disabled={pending.form}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pr-10"
                                onFocus={() => setError("")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={pending.form}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5 text-muted-foreground" />
                                ) : (
                                    <Eye className="size-5 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={pending.form}
                    >
                        {pending ? (
                                <Loader2 className="size-5 animate-spin" />
                        ) : (
                                "Sign In"
                        )}
                    </Button>
                </form>

                <div className="relative my-6">
                <Separator />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                        OR
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => onProviderSignIn("google")}
                        variant="outline"
                        className="w-full h-11 relative"
                        disabled={pending.google}
                    >
                        {pending.google ? (
                            <Loader2 className="size-5 animate-spin absolute left-4" />
                        ) : (
                                <>
                                    <FcGoogle className="size-5 absolute left-4" />
                                    Continue with Google
                                </>
                        )}
                    </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setState("signUp")}
                        className="font-medium text-primary hover:underline"
                        disabled={pending.form || pending.google}
                    >
                        Sign up
                    </button>
                </p>
            </CardContent>
        </Card>
    );
};