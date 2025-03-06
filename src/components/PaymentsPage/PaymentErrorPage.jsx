import React from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import TransitionLink from "../../../utils/TransitionLink";

export default function PaymentErrorPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-700 px-4 py-12 sm:py-20 overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      {/* Backward Raining Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float-up"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Error Content */}
      <div className="relative text-center z-10 text-white max-w-lg sm:max-w-2xl px-6 sm:px-12">
        {/* Animated Exclamation Icon */}
        <div className="p-4 rounded-full inline-flex animate-bounce shadow-lg bg-white bg-opacity-10 backdrop-blur-sm border-2 border-red-500">
          <BsFillExclamationCircleFill className="w-16 sm:w-24 h-16 sm:h-24 text-white transform transition-transform hover:rotate-12 hover:scale-110" />
        </div>

        {/* Error Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mt-6 text-white animate-text-glow">
          Payment Declined!
        </h2>

        {/* Error Message */}
        <p className="mt-3 text-base sm:text-lg text-white text-opacity-80 animate-fade-in">
          Oops! Something went wrong while processing your payment. <br />
          Please try again or contact customer support.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full">
          <TransitionLink
            to="/"
            className="w-full sm:w-auto text-center bg-red-500 cursor-pointer text-white py-3 px-6 sm:px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 hover:bg-red-600 hover:shadow-xl active:scale-95"
          >
            Back to Homepage
          </TransitionLink>
          <TransitionLink
            to="/contactus"
            className="w-full sm:w-auto text-center bg-transparent border-2 cursor-pointer border-red-500 text-white py-3 px-6 sm:px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 hover:border-red-600 hover:shadow-xl active:scale-95"
          >
            Contact Support
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
