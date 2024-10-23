import Image from "next/image";

import Logout from "./Logout";
import Icon from "../general/Icon";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="grid grid-rows-[100px_1fr_50px] gap-y-8 justify-between w-fit h-screen py-2">
      <>
        <Link
          href={"/admin"}
          className="flex flex-row justify-start gap-x-8 items-center p-2"
        >
          <Image
            src={"/logo.png"}
            width={80}
            height={80}
            alt="F1GS Logo"
            priority
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold">F1GS Admin</h1>
        </Link>
        <div className="flex flex-col gap-y-4">
          <Link
            href={"/admin/board"}
            className="flex flex-row px-4 py-2 gap-x-4"
          >
            <Icon size="md" url="/admin/board.png" alt="board" />
            <h2 className="text-lg font-semibold">Board</h2>
          </Link>
          <Link
            href={"/admin/events"}
            className="flex flex-row px-4 py-2 gap-x-4"
          >
            <Icon size="md" url="/admin/events.png" alt="events" />
            <h2 className="text-lg font-semibold">Events</h2>
          </Link>
          <Link
            href={"/admin/members"}
            className="flex flex-row px-4 py-2 gap-x-4"
          >
            <Icon size="md" url="/admin/members.png" alt="members" />
            <h2 className="text-lg font-semibold">Members</h2>
          </Link>
        </div>
      </>
      <Logout></Logout>
    </div>
  );
}
