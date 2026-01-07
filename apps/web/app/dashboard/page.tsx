"use client";

import { authClient } from "@vestly/auth/client";
import { Button } from "@vestly/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@vestly/ui/components/card";
import { Input } from "@vestly/ui/components/input";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronRight,
  History,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async (): Promise<void> => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] dark:bg-slate-950">
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span>Vestly</span>
          </div>
        </div>

        <nav aria-label="Sidebar navigation" className="mt-4 space-y-1 px-3">
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: TrendingUp, label: "Analytics" },
            { icon: History, label: "History" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              aria-current={item.active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
              key={item.label}
              type="button"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-3">
          <button
            aria-label="Log out"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-rose-500 text-sm transition-colors hover:bg-rose-50"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md dark:bg-slate-900/80">
          <div className="relative w-96">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Search assets"
              className="border-none bg-slate-100/50 pl-10 dark:bg-slate-800/50"
              placeholder="Search assets..."
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              aria-label="Notifications"
              className="relative"
              size="icon"
              variant="ghost"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="font-semibold text-sm">{session.user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Premium Member
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                <User className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8 flex items-end justify-between">
            <header>
              <h1 className="font-bold text-2xl tracking-tight">
                Financial Overview
              </h1>
              <p className="text-slate-500">
                Welcome back, here's what's happening with your portfolio today.
              </p>
            </header>
            <Button className="font-semibold" type="button">
              Add New Asset
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Balance",
                value: "$45,231.89",
                trend: "+12.5%",
                positive: true,
              },
              {
                label: "Monthly Revenue",
                value: "$12,450.00",
                trend: "+4.2%",
                positive: true,
              },
              {
                label: "Active Stocks",
                value: "24",
                trend: "-2.1%",
                positive: false,
              },
              {
                label: "Crypto Wallet",
                value: "0.84 BTC",
                trend: "+8.9%",
                positive: true,
              },
            ].map((stat, i) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={stat.label}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-slate-500 text-sm">
                      {stat.label}
                    </CardTitle>
                    {stat.positive ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">{stat.value}</div>
                    <p
                      className={`mt-1 font-medium text-xs ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {stat.trend}{" "}
                      <span className="font-normal text-slate-400">
                        from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="col-span-2 flex min-h-[400px] flex-col items-center justify-center border-none bg-white p-8 shadow-sm dark:bg-slate-900/50">
              <div
                aria-hidden="true"
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Portfolio Performance</h3>
              <p className="mt-2 max-w-sm text-center text-slate-500">
                This is where your detailed portfolio analytics and charts would
                appear.
              </p>
            </Card>
            <Card className="border-none bg-white p-6 shadow-sm dark:bg-slate-900/50">
              <h3 className="mb-4 font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div className="flex items-center gap-3" key={item}>
                    <div
                      aria-hidden="true"
                      className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-800"
                    />
                    <div className="flex-1">
                      <div
                        aria-hidden="true"
                        className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800"
                      />
                      <div
                        aria-hidden="true"
                        className="mt-1 h-2 w-16 rounded bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
