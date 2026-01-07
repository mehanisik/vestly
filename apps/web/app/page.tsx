"use client";

import { authClient } from "@vestly/auth/client";
import { Badge } from "@vestly/ui/components/badge";
import { Button, buttonVariants } from "@vestly/ui/components/button";
import { Separator } from "@vestly/ui/components/separator";
import { cn } from "@vestly/ui/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const res = await api.hello.$get();
        const data = await res.json();
        setMessage(data.message);
      } catch {
        setMessage("API Error");
      }
    }
    fetchGreeting();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 font-sans text-foreground selection:bg-primary/30">
      <nav
        aria-label="Main navigation"
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tighter">VESTLY</span>
          <Badge variant="secondary">Alpha</Badge>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-muted-foreground text-xs sm:inline">
                {session.user.name}
              </span>
              <Button
                onClick={() => authClient.signOut()}
                size="sm"
                variant="outline"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                href="/login"
              >
                Log In
              </Link>
              <Link
                className={cn(buttonVariants({ size: "sm" }))}
                href="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 py-20">
        <div className="space-y-4 text-center">
          <h1 className="font-extrabold text-5xl leading-tight tracking-tighter md:text-7xl">
            ACCOUNTING <br />
            <span className="bg-linear-to-r from-primary to-primary/40 bg-clip-text text-transparent italic">
              REIMAGINED.
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-muted-foreground text-sm md:text-base">
            Type-safe booklet management for the modern individual. Lightning
            fast, secure, and intuitive.
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-md sm:flex-row">
          {session ? (
            <Button className="h-10 w-full text-sm sm:w-48" size="lg">
              Open Booklets
            </Button>
          ) : (
            <>
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 w-full text-sm sm:w-48"
                )}
                href="/signup"
              >
                Get Started
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 w-full text-sm sm:w-48"
                )}
                href="/login"
              >
                Documentation
              </Link>
            </>
          )}
        </div>

        <Separator className="my-8" />

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <section className="space-y-2 border border-primary/10 bg-card/40 p-4 backdrop-blur-sm">
            <h3 className="font-bold text-[10px] text-primary uppercase tracking-widest">
              Status
            </h3>
            <p className="text-muted-foreground text-xs">
              API Connection: <span className="text-foreground">{message}</span>
            </p>
          </section>
          <section className="space-y-2 border border-primary/10 bg-card/40 p-4 backdrop-blur-sm">
            <h3 className="font-bold text-[10px] text-primary uppercase tracking-widest">
              Tech
            </h3>
            <p className="text-muted-foreground text-xs">
              Hono + Better Auth + Drizzle
            </p>
          </section>
          <section className="space-y-2 border border-primary/10 bg-card/40 p-4 backdrop-blur-sm">
            <h3 className="font-bold text-[10px] text-primary uppercase tracking-widest">
              Safety
            </h3>
            <p className="text-muted-foreground text-xs">
              100% Type-safe RPC Client
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
