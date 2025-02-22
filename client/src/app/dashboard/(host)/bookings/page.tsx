"use client";

import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { Booking } from "@/types/booking";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail } from "lucide-react";
import Link from "next/link";

// Fetch Bookings API
async function fetchHostBookings() {
  try {
    const response = await axiosClient.get("/booking");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

// Update Booking Status API
async function confirmBooking(bookingId: string) {
  try {
    await axiosClient.put(`/booking/${bookingId}/status`, { status: "CONFIRMED" });
    toast.success("Booking confirmed successfully!");
    return true;
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    toast.error("Failed to confirm booking.");
    return false;
  }
}
async function cancelBooking(bookingId: string) {
  try {
    await axiosClient.put(`/booking/${bookingId}/status`, { status: "CANCELED" });
    toast.success("Booking canccelled!");
    return true;
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    toast.error("Failed to cancel booking.");
    return false;
  }
}

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      const fetchedBookings = await fetchHostBookings();
      setBookings(fetchedBookings);
      setLoading(false);
    };

    loadBookings();
  }, []);

  const handleConfirm = async (bookingId: string) => {
    setConfirming(bookingId);
    const success = await confirmBooking(bookingId);
    if (success) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CONFIRMED" } : b)));
    }
    setConfirming(null);
  };

  const handleCancel = async (bookingId: string) => {
    setCancelling(bookingId);
    const success = await cancelBooking(bookingId);
    if (success) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELED" } : b)));
    }
    setCancelling(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Bookings for Your Properties</h1>

      {loading ? (
        <div className="flex justify-center items-center flex-1 h-full">
          <Spinner size={40} color="#000" />
        </div>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg flex items-start gap-4">
              <Image
                src={booking.property.thumbnail || "https://via.placeholder.com/70"}
                alt="Thumbnail"
                width={100}
                height={100}
                className="border w-40 h-36 rounded-lg object-cover"
              />
              <div className="w-full">
                <Link href={`/dashboard/properties/${booking.propertyId}`}>
                  <h2 className="text-xl font-semibold hover:underline">{booking.property.title}</h2>
                </Link>
                <div className="text-sm text-gray-600 border-t pt-4 mt-4">
                  <p>Renter Contact Information</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.renter.firstName} {booking.renter.lastName}
                        </h3>
                        <p>{booking.renter.email}</p>
                      </div>
                    </div>
                    <button className="bg-blue-500 py-3 px-4 text-white rounded-xl flex items-center gap-2">
                      <Mail /> Contact Renter
                    </button>
                  </div>

                  <p className="mt-4 flex items-center gap-2 bg-blue-100 p-2">
                    <Calendar /> {format(new Date(booking.checkIn), "MMM dd, yyyy")} – {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm font-semibold mt-4 pt-4 border-t">
                    Status:{" "}
                    <span className={`px-2 py-1 rounded text-white ${booking.status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"}`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {booking.status !== "CONFIRMED" && (
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      disabled={confirming === booking.id}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded disabled:bg-gray-400">
                      {confirming === booking.id ? "Confirming..." : "Confirm Booking"}
                    </button>
                  )}
                  {booking.status !== "CANCELED" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded disabled:bg-gray-400">
                      {cancelling === booking.id ? "Canceling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
