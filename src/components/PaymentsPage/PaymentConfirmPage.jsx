import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import TransitionLink from "../../../utils/TransitionLink";

export default function PaymentConfirmPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-700 px-4 py-12 sm:py-20 overflow-hidden">
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>

      {/* Animated Confetti Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-80 animate-confetti"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Success Content */}
      <div className="relative text-center z-10 text-white max-w-lg sm:max-w-2xl px-6 sm:px-12">
        {/* Animated Checkmark Icon */}
        <div className="p-4 rounded-full inline-flex animate-bounce shadow-lg bg-white bg-opacity-20 backdrop-blur-sm border-2 border-green-500">
          <BsCheckCircleFill className="w-16 sm:w-24 h-16 sm:h-24 text-white transform transition-transform hover:rotate-12 hover:scale-110" />
        </div>

        {/* Success Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mt-6 text-white animate-text-glow">
          Payment Successful!
        </h2>

        {/* Success Message */}
        <p className="mt-3 text-base sm:text-lg text-white text-opacity-80 animate-fade-in">
          Your payment was processed successfully. <br />
          Thank you for your Booking!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full">
          <TransitionLink
            to="/"
            className="w-full sm:w-auto text-center bg-green-500 cursor-pointer text-white py-3 px-6 sm:px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 hover:bg-green-600 hover:shadow-xl active:scale-95"
          >
            Back to Homepage
          </TransitionLink>
          <TransitionLink
            to="/my-bookings"
            className="w-full sm:w-auto text-center bg-transparent border-2 cursor-pointer border-green-500 text-white py-3 px-6 sm:px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 hover:border-green-600 hover:shadow-xl active:scale-95"
          >
            View Bookings
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
