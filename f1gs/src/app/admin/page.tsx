"use client";

// React
import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

// Supabase
import { supabase } from "@/lib/subapase/supabase";
import { Session } from "@supabase/supabase-js";
import { getNonCompletedEvents } from "@/lib/subapase/routes";
import EventCard from "@/components/admin/EventCard";
import { FrontEndEvent } from "@/lib/types";

export default function Admin() {
  const [, setUserSession] = useState<Session | null>(null);

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

  const {
    data,
    // error,
    isLoading,
  } = useQuery<
    {
      totalMembers: number;
      upcomingEvents: { events: FrontEndEvent[]; count: number };
    },
    Error
  >({
    queryKey: ["adminHome"],
    queryFn: getAdminDashboardDetails,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="w-[80%] mx-auto grid grid-cols-3 gap-4 grid-rows-[172px,auto]">
      {isLoading ? (
        [...Array(3)].map((_, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col justify-center items-center mx-auto rounded-xl bg-white border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-[50%] min-w-48 h-full px-2 py-4 animate-pulse"
            ></div>
          );
        })
      ) : (
        <>
          <div className="flex flex-col justify-center items-center mx-auto rounded-xl bg-white border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-[50%] min-w-48 h-full px-2 py-4">
            <h1 className="text-5xl font-bold mb-4">{data?.totalMembers}</h1>
            <h3>Total Members</h3>
          </div>
          <div className="flex flex-col justify-center items-center mx-auto rounded-xl bg-white border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-[50%] min-w-48 h-full px-2 py-4">
            <h1>New Members</h1>
          </div>
          <div className="flex flex-col justify-center items-center mx-auto rounded-xl bg-white border-2 border-[rgba(210, 210, 210, .5)] shadow-carousel w-[50%] min-w-48 h-full px-2 py-4">
            <h1 className="text-5xl font-bold mb-4">
              {data?.upcomingEvents.count}
            </h1>
            <h3>Upcoming Events</h3>
          </div>
        </>
      )}
      <div className="mx-auto w-full col-span-3 text-center">
        <h1 className="text-center text-xl font-bold py-4">Upcoming Events</h1>
        <div
          className={`${
            data?.upcomingEvents.count === 1
              ? "flex "
              : "grid grid-cols-3 grid-rows-auto "
          } justify-center items-center gap-2`}
        >
          {data?.upcomingEvents.events.map((event: FrontEndEvent) => {
            return <EventCard key={event.title} {...event} />;
          })}
        </div>
      </div>
    </div>
  );
}

async function getAdminDashboardDetails() {
  const totalMembersResp = await fetch("/api/mailchimp?action=getMemberCount");
  const { data } = await totalMembersResp.json();

  const upcomingEventsResp = await getNonCompletedEvents();

  return {
    totalMembers: data,
    upcomingEvents: {
      events: upcomingEventsResp,
      count: upcomingEventsResp.length,
    },
  };
}
