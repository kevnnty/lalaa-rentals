"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/config/axios.config";

async function fetchHostBookings() {
  try {
    const res = await axiosClient.get("/booking");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch host properties:", error);
    return [];
  }
}

export default function Page() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      const fetchedBookings = await fetchHostBookings();
      setProperties(fetchedBookings);
      setLoading(false);
    };

    loadProperties();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <p>Loading properties...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Bookings to your properties</h1>
      {properties.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        properties.map((property: any) => (
          <div key={property.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p>{property.description}</p>
            <h3 className="text-lg font-bold">Bookings:</h3>
            {property.bookings.length > 0 ? (
              <ul>
                {property.bookings.map((booking: any) => (
                  <li key={booking.id} className="text-sm text-gray-600">
                    {booking.user.name} ({booking.user.email}) - {new Date(booking.checkIn).toDateString()} to {new Date(booking.checkOut).toDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
