"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Users, Home, Wallet, MapPin } from "lucide-react";
import axiosClient from "@/config/axios.config";
import { toast } from "react-hot-toast";
import { Property } from "@/types/property";
import { Booking } from "@/types/booking";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

export default function HostDashboard() {
  const [hostProperties, setHostProperties] = useState<Property[]>([]);
  const [recentPropertyBookings, setRecentPropertyBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalEarnings: 0,
    totalCustomers: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const propertiesRes = await axiosClient.get("/properties/host");
      const properties = propertiesRes.data.data;
      setHostProperties(properties);

      const bookingsRes = await axiosClient.get("/booking");
      const bookings = bookingsRes.data.data;
      setRecentPropertyBookings(bookings);

      const totalEarnings = bookings.reduce((acc: number, booking: Booking) => acc + booking.property.price, 0);
      const totalCustomers = new Set(bookings.filter((booking: Booking) => booking.status === "CONFIRMED").map((booking: Booking) => booking.renter.id)).size;

      setStats({
        totalProperties: properties.length,
        totalBookings: bookings.length,
        totalEarnings,
        totalCustomers,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Host Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox icon={<Home size={35} />} theme="#16a34a" title="Total Properties" value={stats.totalProperties} />
        <StatBox icon={<BarChart size={35} />} theme="#2563eb" title="Total Bookings" value={stats.totalBookings} />
        <StatBox icon={<Wallet size={35} />} theme="#9333ea" title="Earnings" value={`$${stats.totalEarnings.toLocaleString()}`} />
        <StatBox icon={<Users size={35} />} theme="#db2777" title="Your Tenants" value={stats.totalCustomers} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSection title="Your Properties">
          <p>Manage all your listed properties.</p>
          <div className="divide-y">
            {hostProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
          <Link href="/dashboard/properties/host">
            <button className="w-full bg-blue-500 py-2 px-4 rounded text-white">View All Properties</button>
          </Link>
        </DashboardSection>
        <DashboardSection title="Recent Bookings">
          {recentPropertyBookings.length > 0 ? (
            <div className="space-y-3">
              {recentPropertyBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent bookings found.</p>
          )}

          <Link href="/dashbord/bookings">
            <button className="bg-blue-500 py-2 px-4 w-full rounded text-white mt-3">View All Bookings</button>
          </Link>
        </DashboardSection>
      </div>
    </div>
  );
}

function StatBox({ icon, title, value, theme }: { icon: React.ReactNode; title: string; value: number | string; theme: string }) {
  return (
    <div className="flex items-center p-5 border rounded-2xl bg-white">
      <div className={`flex items-center justify-center text-primary p-3 rounded-xl`} style={{ color: theme, backgroundColor: `${theme}20` }}>
        <span>{icon}</span>
      </div>
      <div className="ml-5">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 border rounded-2xl bg-white space-y-4">
      <h2 className="text-xl font-semibold mb-2 border-b pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function PropertyCard(property: Property) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div>
        <Image src={property.thumbnail} alt="" width={70} height={70} className="h-16 w-20 border rounded-lg object-cover" />
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full">
          <h2 className="text-lg font-semibold">{property.title}</h2>
          <p className="flex items-center gap-1">
            <MapPin size={20} />
            {property.location}
          </p>
        </div>
        <h3 className="text-3xl text-blue-500 flex items-end">
          ${property.price.toLocaleString("en-us")} <span className="text-gray-500 text-sm">/night</span>
        </h3>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="p-3 border rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{booking.property?.title || "Unknown Property"}</h3>
        <p className="text-sm text-gray-500">
          {/* ✅ Formatted Dates Using date-fns */}
          {format(new Date(booking.checkIn), "MMM dd, yyyy")} – {format(new Date(booking.checkOut), "MMM dd, yyyy")}
        </p>
        <p className="text-sm text-gray-700 font-semibold">Status: {booking.status}</p>
      </div>
      <img src={booking.property?.thumbnail || "https://via.placeholder.com/50"} alt="Property Thumbnail" className="h-12 w-12 rounded-lg object-cover" />
    </div>
  );
}
