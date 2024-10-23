"use client";

// React
import React, { useState, useEffect } from "react";

// Supabase
import { supabase } from "@/lib/subapase/supabase";
import { Session } from "@supabase/supabase-js";

export default function Admin() {
  const [userSession, setUserSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <h1>Admin Page!</h1>;
}
