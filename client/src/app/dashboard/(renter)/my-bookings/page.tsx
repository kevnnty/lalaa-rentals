"use client";

import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { Booking } from "@/types/booking";
import { format } from "date-fns"; // Import date-fns for formatting
import { ArrowRight, Calendar, ChevronRight, LayoutDashboardIcon, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/booking/my-bookings");
        setBookings(response.data.data);
      } catch (err: any) {
        setError("Failed to fetch bookings. Please try again later.");
        toast.error(err?.response?.data?.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Link href="/dashboard" className="hover:bg-blue-100 px-3 py-2 rounded-full transition-all">
            <h3 className="flex items-center gap-2 text-blue-500">
              <LayoutDashboardIcon /> Dashboard
            </h3>
          </Link>
          <ChevronRight />
          <Link href="#" className="px-3 py-2 rounded-full transition-all">
            My bookings
          </Link>
        </div>
        <Link href="/dashboard/properties">
          <button className="bg-blue-500 px-4 py-3 rounded-lg text-white flex gap-2 items-center">
            Explore Listed Properties
            <ArrowRight />
          </button>
        </Link>
      </div>
      {loading && (
        <div className="flex-1 flex justify-center items-center">
          <Spinner size={40} color="#00" />
        </div>
      )}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center flex-1 h-full">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      )}
      {!error && !loading && (
        <div>
          <div className="w-full mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">My bookings</h1>
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings ye.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border shadow-lg shadow-gray-100 rounded-2xl overflow-hidden group">
                    <div className="h-60 overflow-hidden">
                      <Image
                        src={booking.property.thumbnail}
                        alt={booking.property.title}
                        width={500}
                        height={400}
                        className="w-full h-60 object-cover group-hover:scale-110 transition-all duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-blue-500">{booking.property.title}</h3>

                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="ml-2">{booking.property.location}</span>
                      </div>

                      <div className="flex items-center mt-4 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="ml-2">
                          {format(new Date(booking.checkIn), "MMM dd, yyyy")} - {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                        </span>
                      </div>

                      <div className="mt-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800"
                              : booking.status === "CONFIRMED"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
