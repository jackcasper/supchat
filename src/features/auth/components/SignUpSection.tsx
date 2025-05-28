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
import { useState, useMemo } from "react";
import { TriangleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpSectionProps {
    setState: (state: SignInFlow) => void;
};

export const SignUpSection = ({ setState }: SignUpSectionProps) => {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, setPending] = useState<{ form?: boolean; google?: boolean }>({});
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordStrength = useMemo(() => {
        if (!password) return 0;

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        return strength;
    }, [password]);

    const onPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending({form: true});
        setError("");

        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords don't match");
            }
            if (passwordStrength < 3) {
                throw new Error("Please choose a stronger password");
            }

            await signIn("password", { name, email, password, flow: "signUp" });
        } catch (err) {
            console.error("Sign up error:", err);
            setError(err instanceof Error ? err.message : "An error occurred during sign uo");
        } finally {
            setPending({});
        }
    };

    const onProviderSignUp = async (value: "google") => {
        setPending({google: true});
        setError("");
        
        try {
            await signIn(value);
        } catch (err) {
            console.error("Google sign up error:", err);
            setError("Failed to sign up with Google");
        } finally {
            setPending({});
        }
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold">
                    Create your account
                </CardTitle>
                <CardDescription className="text-sm">
                    Get started with Supchat
                </CardDescription>
            </CardHeader>

            {error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}

            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onPasswordSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            disabled={pending.form}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            required
                            className="h-11"
                        />
                        <Input
                            disabled={pending.form}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                                className="h-11 pr-10"
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
                        <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`flex-1 rounded-full ${
                                        passwordStrength >= level
                                        ? level === 1 ? "bg-red-500" :
                                            level === 2 ? "bg-yellow-500" :
                                                level === 3 ? "bg-blue-500" : "bg-green-500"
                                        : "bg-muted"
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {password ? (
                                `Strength:${["Weak", "Fair", "Good", "Strong"] [passwordStrength - 1] || "Very Weak"}`
                            ) : (
                                    "Include uppercase, numbers and symbols"
                            )}
                        </p>
                        <div className="relative">
                            <Input
                                disabled={pending.form}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="h-11 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={pending.form}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-5 text-muted-foreground" />
                                ) : (
                                    <Eye className="size-5 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={pending.form}
                    >
                        {pending.form ? (    
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                                "Create Account"
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
                        onClick={() => onProviderSignUp("google")}
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

                <p className="text-sm text-center text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setState("signIn")}
                        className="font-medium text-primary hover:underline"
                        disabled={pending.form || pending.google}
                    >
                        Sign in
                    </button>
                </p>
            </CardContent>
        </Card>
    );
};