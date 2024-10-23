"use client";

// React / NextJS
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Components / Functions
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { supabase } from "@/lib/subapase/supabase";

// External Libraries
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const pageMap: Record<string, string> = {
  board: "Our Board",
  events: "Events",
  members: "F1GS Members",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, setUserSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUserSession(session); // Set session if authenticated
      }
    };

    checkAuth();

    // Subscribe to authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const buildPageTile = () => {
    const pageRoute = pathname.split("/").pop()!;
    return pageMap[pageRoute];
  };

  return (
    <div className="grid grid-cols-[300px_auto]">
      <Sidebar></Sidebar>
      <div className="grid grid-rows-[100px_auto]">
        <Header componentTitle={buildPageTile()}></Header>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </div>
  );
}
