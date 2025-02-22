"use client";

import { useAuth } from "@/lib/store/features/auth/auth.selector";
import HostDashboard from "./(host)/HostDashboard";
import RenterDashboard from "./(renter)/RenterDashboard";

export default function Dashboard() {
  const { currentUser } = useAuth();

  return currentUser?.role == "HOST" ? <HostDashboard /> : <RenterDashboard />;
}
