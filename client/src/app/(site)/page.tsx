"use client";

import { ChevronRight, House, Users } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div>
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="text-center flex flex-col items-center space-y-2.5 mb-12">
          <House size={40} color="#3b82f6" />

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 mb-4">
            Welcome to Lalaa Rentals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Choose your role to get started with a personalized experience on Lalaa Rentals.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          <div>
            <Link href="/auth/register?role=HOST">
              <div className="relative group bg-white backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl border border-purple-100/50">
                <div className="flex items-start space-x-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-0.5 shadow-lg transition-all duration-500">
                    <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-800 flex items-center justify-center">
                      <House className="w-7 h-7 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">I'm a Property Host</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">List your properties, manage bookings, and connect with renters</p>
                    <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium transition-all duration-300">
                      Get Started
                      <div className="ml-1">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div>
            <Link href="/auth/register?role=RENTER">
              <div className="relative group bg-white backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl border border-purple-100/50">
                <div className="flex items-start space-x-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-0.5 shadow-lg transition-all duration-500">
                    <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-800 flex items-center justify-center">
                      <Users className="w-7 h-7 text-green-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">I'm a Renter</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Browse listings, make bookings, and find the perfect place to stay</p>
                    <div className="inline-flex items-center text-green-600 dark:text-green-400 font-medium transition-all duration-300">
                      Get Started
                      <div className="ml-1">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Already have an account?</p>
          <Link href={`/auth/login`} className="inline-flex items-center px-6 py-3 text-white bg-blue-500 rounded-xl font-medium transition-all duration-300">
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
