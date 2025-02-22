"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { Booking } from "@/types/booking";
import { Property } from "@/types/property";
import { format } from "date-fns";
import { Calendar, Loader2, Mail, MapPin, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PropertySearch from "./components/PropertySearch";

export default function RenterDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchBookings = async () => {
      try {
        const response = await axiosClient.get("/booking/my-bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await axiosClient.get("/properties");
        setProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchBookings();
    fetchProperties();
    setLoading(false);
  }, []);

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axiosClient.put(`/booking/${bookingId}/status`, { status: "CANCELED" });
      alert("Booking canceled successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Renter Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage and track your rental bookings.</p>

      <PropertySearch />

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Spinner size={40} color="#000" />
        </div>
      )}

      {!loading && bookings.length === 0 && <p className="text-gray-500 mt-6">You haven't booked any properties yet.</p>}

      {!loading && bookings.length > 0 && (
        <div className="grid gap-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">Your bookings</h2>

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
                  <p>Host Contact Information</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.property.host.firstName} {booking.property.host.lastName}
                        </h3>
                        <p>{booking.property.host.email}</p>
                      </div>
                    </div>
                    <button className="bg-blue-500 py-3 px-4 text-white rounded-xl flex items-center gap-2">
                      <Mail /> Contact Host
                    </button>
                  </div>

                  <p className="mt-4 flex items-center gap-2 bg-blue-100 p-2">
                    <Calendar /> {format(new Date(booking.checkIn), "MMM dd, yyyy")} – {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                  </p>
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
            </div>
          ))}
        </div>
      )}

      {/* Available Properties Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Available Properties</h2>
        {properties.length === 0 ? (
          <p className="text-gray-500">No available properties at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={property.thumbnail || "https://via.placeholder.com/400"}
                  alt={property.title}
                  width={500}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-blue-500">{property.title}</h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="ml-2">{property.location}</span>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    <span className="font-semibold">Price:</span> ${property.price}/night
                  </div>

                  <Link href={`/dashboard/properties/${property.id}`}>
                    <button className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded w-full transition">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
