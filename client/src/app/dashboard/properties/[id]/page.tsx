"use client";

import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { Property } from "@/types/property";
import { ArrowLeft, ArrowRight, Edit, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "swiper/css"; // import the swiper styles
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingModal from "./components/BookingModal";
import { useAuth } from "@/lib/store/features/auth/auth.selector";

export default function ProductPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await axiosClient.get(`/properties/${id}`);
        setProperty(response.data.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return (
    <>
      <div className="flex-1 flex-col h-full  w-full relative">
        {loading && (
          <div className="flex justify-center items-center flex-1 h-full">
            <Spinner size={40} color="#000" />
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
        {!error && !loading && property && (
          <div className="space-y-5">
            <div className="border rounded-xl p-7">
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <p className="flex items-center gap-1">
                    <MapPin size={20} color="#2563eb" /> {property.location}
                  </p>
                </div>
                {currentUser?.role === "RENTER" && (
                  <button onClick={() => setBookingModalOpen(true)} className="px-5 py-3.5 bg-blue-500 rounded-lg text-white">
                    Book reservation
                  </button>
                )}
                {currentUser?.id === property.hostId && (
                  <div className="flex justify-center items-center gap-2">
                    <button className="flex items-center gap-2 border px-4 py-3 rounded-lg">
                      <Edit />
                      Update details
                    </button>
                    <button className="flex items-center gap-2 border px-4 py-3 rounded-lg">
                      <Trash2 />
                      Delete property
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <Image src={property.thumbnail} alt={property.title} width={600} height={400} className="w-full h-96 object-cover rounded-lg mb-4 border" />
                <div className="w-full">
                  <p className="text-gray-700">{property.description}</p>

                  <div className="mt-4 space-y-3">
                    <p className="text-blue-600 text-4xl">
                      $
                      {property.price.toLocaleString("en-us", {
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-gray-400 text-base">/night</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-7">
              <h2 className="text-xl font-semibold">Available Facilities</h2>
            </div>
            <div className="border rounded-xl p-7">
              {property.attachments && property.attachments.length > 0 && (
                <div className="mt-6 relative w-full max-w-3xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Image Gallery</h2>
                    <div className="flex justify-center items-center gap-2">
                      <button className="button-prev-slide h-12 w-12 outline-none rounded-full flex justify-center items-center border border-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300">
                        <ArrowLeft size={24} />
                      </button>
                      <button className="button-next-slide h-12 w-12 outline-none rounded-full flex justify-center items-center border border-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300">
                        <ArrowRight size={24} />
                      </button>
                    </div>
                  </div>
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    navigation={{
                      nextEl: ".button-next-slide",
                      prevEl: ".button-prev-slide",
                    }}
                    autoplay={{ delay: 3000 }}
                    modules={[Navigation, Autoplay]}
                    className="mt-2 mySwiper">
                    {property.attachments.map((attachment, index) => (
                      <SwiperSlide key={index}>
                        <Image src={attachment} alt={`Attachment ${index + 1}`} width={500} height={500} className="w-full h-96 object-cover rounded" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
            <div className="border rounded-xl p-7">
              <h2 className="text-xl font-semibold">Owner Contact Info</h2>
            </div>
            <BookingModal isOpen={bookingModalOpen} setIsOpen={setBookingModalOpen} property={property!} />
          </div>
        )}
      </div>
    </>
  );
}
