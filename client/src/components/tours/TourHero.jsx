import React from 'react';

const TourHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-teal-400 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover Amazing Tours
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-white">
          Explore the world with our carefully curated tour packages for unforgettable experiences
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <a
              href="#all-tours"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8"
            >
              View Tours
            </a>
            <a
              href="#recommended-tours"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
            >
              Featured Packages
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourHero;