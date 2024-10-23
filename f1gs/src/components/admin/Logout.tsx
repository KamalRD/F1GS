import { signOut } from "@/lib/subapase/auth";

export default function Logout() {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
    >
      Log Out!
    </button>
  );
}
