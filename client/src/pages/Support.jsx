// pages/Support.jsx
import React, { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
      setSubmitted(true);
      // Optionally reset form here if desired: setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          How Can We Help You Today? 🚀
        </h1>

        {/* --- */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              className="w-7 h-7 mr-3 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9.247a8.47 8.47 0 00-1.464-.803C5.592 7.747 4.148 7.5 2 7.5c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5c2.148 0 3.592-.247 4.764-.702a8.47 8.47 0 001.464-.803c1.172-.455 2.616-.702 4.764-.702s3.592.247 4.764.702a8.47 8.47 0 001.464.803C21.408 15.253 22.852 15.5 25 15.5c2 0 3.5-1.5 3.5-3.5s-1.5-3.5-3.5-3.5c-2.148 0-3.592.247-4.764.702z"
              ></path>
            </svg>
            Frequently Asked Questions (FAQs)
          </h2>
          <ul className="space-y-5 text-base text-gray-700">
            <li>
              <strong className="text-gray-900">How do I transfer a parcel?</strong>
              <br />
              Navigate to the "<span className="font-semibold text-blue-600">My Parcels</span>" section and select "Transfer" next to the parcel you wish to move.
            </li>
            <li>
              <strong className="text-gray-900">Can I file a land dispute online?</strong>
              <br />
              Absolutely! Under the "<span className="font-semibold text-blue-600">Disputes</span>" section, click on "<span className="font-semibold text-blue-600">File New Dispute</span>" to submit your case.
            </li>
            <li>
              <strong className="text-gray-900">How do I download my title deed?</strong>
              <br />
              Simply go to "<span className="font-semibold text-blue-600">My Documents</span>" and click the "<span className="font-semibold text-blue-600">Download</span>" button beside your title deed.
            </li>
          </ul>
        </div>

        {/* --- */}

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              className="w-7 h-7 mr-3 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            Still Need Personalized Help? Contact Us!
          </h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-3 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="font-semibold text-lg">
                Your message has been successfully submitted! We'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email Address
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y transition duration-150 ease-in-out"
                  placeholder="Tell us how we can assist you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Send Message
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* --- */}

        <div className="mt-12 text-center text-gray-700">
          <p className="text-lg font-semibold mb-4">You can also reach us directly:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <p className="flex items-center text-md">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <strong className="mr-1">Email:</strong> support@landsys.ke
            </p>
            <p className="flex items-center text-md">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684L10.5 9.5l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5-3.5 1.5-1.5-3.5-3.5-1.5-1.5 3.5-3.5z"
                ></path>
              </svg>
              <strong className="mr-1">Hotline:</strong> +254 700 123 456
            </p>
            <p className="flex items-center text-md">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24L1.87 18.27C-.14 15.68-.02 12.44 2.21 9.94c2.23-2.5 5.5-3.53 8.77-2.91 3.27.62 6.1 2.92 7.6 5.86 1.5 2.94 1.25 6.45-.66 9.17L24 22.13.057 24z"></path>
              </svg>
              <strong className="mr-1">WhatsApp:</strong> +254 711 987 654
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}