"use client";

import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialPending(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } finally {
      setSocialPending(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { error: loginError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (loginError) {
        setError(loginError.message || "Invalid credentials or login failed.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-screen overflow-hidden">
      {/* Left Decoration / Hero Side */}
      <div className="relative hidden w-1/2 flex-col bg-slate-900 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-grid-primary/10" />

        <div className="relative z-20 flex items-center font-medium text-lg">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Vestly</span>
        </div>

        <div className="relative z-20 mt-auto">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-bold text-4xl leading-tight">
              Manage your assets with <br />
              <span className="text-primary italic">Precision & Style.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              The only platform that combines deep analytics with an interface
              designed for the modern investor.
            </p>
          </motion.div>

          <div className="mt-12 flex gap-8">
            <div className="space-y-1">
              <p className="font-bold text-2xl">12k+</p>
              <p className="text-slate-500 text-sm">Active Investors</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl">$1.2B</p>
              <p className="text-slate-500 text-sm">Assets Managed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              className="group h-12 hover:border-primary/50"
              disabled={!!socialPending || pending}
              onClick={() => handleSocialLogin("github")}
              variant="outline"
            >
              <GithubLogo
                className="mr-2 h-5 w-5 transition-transform group-hover:scale-110"
                weight="fill"
              />
              GitHub
            </Button>
            <Button
              className="group h-12 hover:border-primary/50"
              disabled={!!socialPending || pending}
              onClick={() => handleSocialLogin("google")}
              variant="outline"
            >
              <GoogleLogo
                className="mr-2 h-5 w-5 transition-transform group-hover:scale-110"
                weight="fill"
              />
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-11 pl-10"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-primary text-xs hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-11 pr-10 pl-10"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-center font-medium text-destructive text-sm"
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              className="h-11 w-full font-semibold text-base transition-all active:scale-[0.98]"
              disabled={pending}
              type="submit"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Log In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <a
              className="font-semibold text-primary hover:underline"
              href="/signup"
            >
              Sign up for free
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
