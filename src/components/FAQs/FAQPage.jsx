import Aos from "aos";
import { useState, useEffect } from "react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
      once: true, // Ensures animation runs only once
    });
  }, []);
  const faqs = [
    {
      question: "What is Trippo Bazar?",
      answer:
        "Trippo Bazaar is an online platform that offers travel-related services, including booking flights, hotels, car rentals, and curated travel experiences.",
    },
    {
      question: "How do I book a flight on Trippo Bazar?",
      answer:
        "To book a flight, enter your departure and destination cities, select your travel dates, and choose from the available flights. Follow the prompts to complete your booking.",
    },
    {
      question: "Can i Cancel or Change My Bookings?",
      answer:
        "Yes, you can cancel or modify your booking through our website or by contacting our customer support. Please note that cancellation and change fees may apply depending on the airline or hotel policies.",
    },
    {
      question: "How Do I Contact Customer Support ? ",
      answer:
        "Yes, you can cancel or modify your booking through our website or by contacting our customer support. Please note that cancellation and change fees may apply depending on the airline or hotel policies.",
    },
    {
      question: "Are There Any Travel Deals Or Discounts Available ? ",
      answer:
        'Yes, we frequently offer deals and discounts on flights, hotels, and travel packages. Check our "Deals" section for the latest offers.',
    },
    {
      question: "How Do I Find And Book Travel Experience ?",
      answer:
        'Explore our "Experiences" section to discover a variety of curated activities and tours. Select the experience you’re interested in and follow the booking instructions.',
    },
    {
      question: "What Payment Methods Do You Accept ?",
      answer:
        "We accept major credit cards, debit cards, and PayPal. All payments are securely processed.",
    },
    {
      question: "Is My Personsl Information Safe On Trippo Bazar?",
      answer:
        "Yes, we use advanced security measures to protect your personal and payment information. For more details, please review our Privacy Policy.",
    },
    {
      question: "How Do I Signup for Trippo Bazar Newsletter ?",
      answer:
        "You can sign up for our newsletter by entering your email address in the subscription box located at the bottom of our homepage. Stay updated on the latest travel deals and news.",
    },
    {
      question: "What Should I Do If Encounter Issues With My Bookings?",
      answer:
        "If you experience any issues, please contact our customer support team immediately for assistance.",
    },
    {
      question: "Can I Earn Rewards or Points For Bookings ?",
      answer:
        'Yes, we have a loyalty program that allows you to earn points for every booking. Points can be redeemed for discounts on future bookings. Visit our "Loyalty Program" page for more information.',
    },
    {
      question: "How Do I Check My Bookin Status ?",
      answer:
        'Log in to your Trippo Bazaar account and go to the "My Bookings" section to view your booking details and status.',
    },
    {
      question: "What Travel Documents Do I Need ?",
      answer:
        "Travel document requirements vary depending on your destination. Generally, you will need a valid passport and possibly a visa. Check the specific entry requirements for your destination country.",
    },

    {
      question: "Does Trippo Bazar Offer Travel Insurance?",
      answer:
        "Yes, we offer travel insurance options that you can add to your booking for additional protection.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-start mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              data-aos="fade-up" // <-- AOS animation applied here
              className={`w-full flex justify-between items-center p-4 transition-all duration-300 ${
                openIndex === index
                  ? "bg-green-50 text-med-green"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <p className="text-left font-medium">{faq.question}</p>
              <span
                className={`${
                  openIndex === index ? "text-green-600" : "text-gray-600"
                }`}
              >
                {openIndex === index ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )}
              </span>
            </button>

            {openIndex === index && (
              <div className="p-4 bg-white">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
