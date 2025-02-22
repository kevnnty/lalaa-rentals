"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Sliders } from "lucide-react";
import axiosClient from "@/config/axios.config";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";

export default function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 5000],
    amenities: [] as string[],
    startDate: "",
    endDate: "",
    showFilters: false,
  });

  // Fetch properties on initial load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosClient.get("/properties");
        setProperties(response.data.data);
        setFilteredProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes (including date range)
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
      }));
    } else if (type === "range") {
      setFilters((prev) => ({
        ...prev,
        [name]: [value[0], value[1]],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Filter properties based on search query, filters, and date range
  useEffect(() => {
    let result = properties.filter((property) => {
      const matchSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation = filters.location ? property.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const matchAmenities = filters.amenities.length === 0 || filters.amenities.every((amenity) => property.amenities.includes(amenity));
      const matchAvailability =
        (!filters.startDate || new Date(property.availableFrom) <= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(property.availableUntil) >= new Date(filters.endDate));

      return matchSearch && matchLocation && matchPrice && matchAmenities && matchAvailability;
    });

    setFilteredProperties(result);
  }, [searchQuery, filters, properties]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <div className="flex items-center justify-between space-x-4 mt-6">
        {/* Search Bar */}
        <div className="relative flex items-center border rounded-lg p-2 w-full max-w-lg">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search properties" className="ml-2 w-full px-2 py-1 outline-none" />
          {searchQuery && filteredProperties.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border mt-2 max-h-60 overflow-y-auto z-10 shadow-lg">
              {filteredProperties.map((property) => (
                <div key={property.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  <div>{property.title}</div>
                  <div className="text-sm text-gray-600">{property.location}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Icon */}
        <div onClick={() => setFilters({ ...filters, showFilters: !filters.showFilters })} className="cursor-pointer text-gray-500">
          <Sliders className="w-6 h-6" />
        </div>
      </div>

      {/* Filters Section */}
      {filters.showFilters && (
        <div className="border p-4">
          <h3 className="font-semibold text-lg">Filters</h3>

          {/* Location Filter */}
          <div className="mt-4">
            <label className="font-semibold">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full mt-2 border p-2 rounded"
              placeholder="Enter location"
            />
          </div>

          {/* Price Range Filter */}
          <div className="mt-4">
            <label className="font-semibold">Price Range</label>
            <input type="range" name="priceRange" min="0" max="5000" value={filters.priceRange} onChange={handleFilterChange} className="w-full mt-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mt-4">
            <label className="font-semibold">Available From</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full mt-2 border p-2 rounded" />
            <label className="font-semibold mt-4">Available Until</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full mt-2 border p-2 rounded" />
          </div>

          {/* Amenities Filter */}
          <div className="mt-4">
            <label className="font-semibold">Amenities</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Wi-Fi", "Parking", "Air Conditioning", "Pool"].map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity}
                    name="amenities"
                    value={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <label htmlFor={amenity}>{amenity}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
