import React from "react";
import { BarChart, Users, Home, Wallet } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox icon={<Home />} title="Total Properties" value="24" />
        <StatBox icon={<BarChart />} title="Total Bookings" value="128" />
        <StatBox icon={<Wallet />} title="Earnings" value="$12,340" />
        <StatBox icon={<Users />} title="Total Users" value="742" />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSection title="Your Properties">
          <p>Manage all your listed properties.</p>
          <button className="btn">Add Property</button>
        </DashboardSection>
        <DashboardSection title="Recent Bookings">
          <p>View recent and upcoming bookings.</p>
          <button className="btn">View Bookings</button>
        </DashboardSection>
      </div>
    </div>
  );
}

// Custom Stat Box Component
function StatBox({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-md bg-white">
      <div className="h-10 w-10 flex items-center justify-center text-primary">{icon}</div>
      <div className="ml-4">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// Custom Dashboard Section Component
function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
