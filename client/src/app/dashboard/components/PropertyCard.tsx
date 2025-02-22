import { Property } from "@/types/property";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="relative group border rounded-3xl overflow-hidden shadow-lg shadow-gray-100 transition-all duration-300">
      <div className="h-60 overflow-hidden">
        <Image
          src={property.thumbnail}
          alt={property.title}
          width={500}
          height={400}
          className="w-full h-60 object-cover group-hover:scale-110 transition-all duration-500"
        />
      </div>
      {property.bookings.some((booking) => booking.status === "CONFIRMED") && (
        <div className="bg-yellow-400 text-yellow-950 absolute z-[2] top-4 right-4 px-2 py-1 rounded-full">Booked</div>
      )}
      <div className="space-y-2 p-6">
        <h2 className="text-2xl font-semibold">{property.title}</h2>
        <p className="text-gray-600 line-clamp-3">{property.description}</p>
        <p className="text-blue-600 text-4xl">
          $
          {property.price.toLocaleString("en-us", {
            maximumFractionDigits: 2,
          })}{" "}
          <span className="text-gray-400 text-base">/night</span>
        </p>
        <p className="flex gap-1 items-center font-semibold">
          <MapPin size={20} /> {property.location}
        </p>
      </div>
      <Link
        href={`/dashboard/properties/${property.id}`}
        className="group/inner absolute bottom-4 right-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full hover:w-28 transition-all duration-500">
        <div className="w-0 opacity-0 group-hover/inner:opacity-100 group-hover/inner:w-14 transition-all duration-300">
          <span className="ml-3">View</span>
        </div>
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
}
