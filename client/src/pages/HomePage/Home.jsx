import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <img src="https://images.pexels.com/photos/55367/pexels-photo-55367.jpeg" alt="Logo" className="h-10" />
        <Link
          to="/login"
          className="text-blue-600 font-semibold rounded-full hover:underline"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center bg-blue-600 text-white px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Our Land Management System
        </h1>
        <p className="max-w-xl text-lg">
          Manage your land parcels, track transfers, resolve disputes, and stay organized — all in one platform.
        </p>
        <Link
          to="/signup"
          className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4">What We Do</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          Our platform simplifies land ownership management by digitizing parcel tracking, document storage, and dispute resolution processes. Designed for both administrators and users, we provide transparency and security for every transaction.
        </p>
      </section>

      {/* Venture With Us Banner */}
      <section className="px-6 py-12 bg-yellow-200 text-center">
        <h3 className="text-2xl font-bold mb-2">Venture With Us</h3>
        <p className="max-w-xl mx-auto">
          Join us in revolutionizing land administration. Whether you're a property owner, developer, or government agency — our tools are built for you.
        </p>
        <Link
          to="/signup"
          className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Partner Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center px-6 py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} Land Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
