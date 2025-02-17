"use client";

import { API_URL } from "@/lib/api";

export default function Home() {
  const handleClick = () => {
    window.location.href = `${API_URL}/auth/google`;
  };
  return <button onClick={handleClick}>Continue with Google</button>;
}
