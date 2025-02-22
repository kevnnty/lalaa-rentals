"use client";

import PropertyCard from "@/app/dashboard/components/PropertyCard";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { useAuth } from "@/lib/store/features/auth/auth.selector";
import { Property } from "@/types/property";
import { ChevronRight, LayoutDashboardIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosClient.get("/properties/host");
        setProperties(response.data.data);
      } catch (error: any) {
        toast.error(error.response.data.message || "Could not get properties, try again later");
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <Link href="/dashboard" className="hover:bg-blue-100 px-3 py-2 rounded-full transition-all">
            <h3 className="flex items-center gap-2 text-blue-500">
              <LayoutDashboardIcon /> Dashboard
            </h3>{" "}
          </Link>
          <ChevronRight />
          <Link href="#" className="px-3 py-2 rounded-full transition-all">
            <h3>{currentUser?.role === "HOST" ? "My Properties" : "Available Properties"}</h3>
          </Link>
        </div>
        {currentUser?.role === "HOST" && (
          <Link href="/dashboard/properties/new">
            <button className="bg-blue-500 px-4 py-3 rounded-lg text-white flex gap-2 items-center">
              <Plus /> Add New Property
            </button>
          </Link>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center flex-1 h-full">
          <Spinner size={40} color="#000" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-1 h-full">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      ) : (
        <div className="w-full mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6">{currentUser?.role === "HOST" ? "Manage Your Properties" : "Explore properties"}</h1>
          {properties.length === 0 ? (
            <p className="text-gray-500">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
