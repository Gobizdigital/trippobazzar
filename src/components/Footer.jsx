import CompanyLogo from "../../svgs/CompanyLogo";
import { socialMediaData } from "../../utils/SocialMediaData";
import TransitionLink from "../../utils/TransitionLink";

function Footer() {
  const data = [
    { name: "About Us", link: "/aboutus" },
    { name: "Careers", link: "/aboutus/careers" },
    { name: "Privacy Policy", link: "/aboutus/privacy-policy" },
    { name: "FAQs", link: "/faqs" },
    { name: "Destination", link: "/destination" },
    { name: "Contact Us", link: "/contactus" },
    { name: "Search Destinations", link: "/searchpage" },
    { name: "Booking Conditions", link: "/booking-conditions" },
    { name: "My Reservations", link: "/my-reservations" },
    { name: "Explore Packages", link: "/explore-packages" },
    { name: "Safety Measures", link: "/safety-measures" },
    { name: "Health Concerns", link: "/health-concerns" },
  ];

  return (
    <footer className="text-center max-w-[1920px] mx-auto text-black pb-6 bg-white">
      <div className="mx-auto w-[90%] py-10 flex flex-col md:flex-row md:justify-between items-center md:items-start">
        {/* Logo Section */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="focus:outline-none"
        >
          <CompanyLogo className="w-2 h-2 sm:w-7 sm:h-7 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain" />
        </button>

        {/* Navigation Links */}
        <ul
          role="list"
          className="flex text-[.8rem] flex-wrap md:grid text-left md:grid-cols-2 md:gap-y-2 md:gap-x-12 gap-4 justify-center mb-8 md:text-base md:text-start md:mb-0"
        >
          {data.map((item, idx) => (
            <li key={idx} role="listitem">
              <TransitionLink
                to={item.link}
                className="text-gray-700 cursor-pointer hover:text-black py-1 relative transition-all duration-300 before:absolute before:w-full before:h-[2px] before:bg-med-green before:bottom-0 before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100"
                aria-label={item.name}
              >
                {item.name}
              </TransitionLink>
            </li>
          ))}
        </ul>

        {/* Contact and Subscribe Section */}
        <div className="flex flex-col w-full max-w-sm md:w-[25%] gap-0 md:gap-2 text-sm text-center md:text-start">
          {/* Contact Information */}
          <div className="mb-8">
            <p className="text-med-green mb-3 font-semibold">Contact Us</p>
            <p className="mb-1">contact@trippobazzar.com</p>
            <p>+9189805 27418 | +9197128 33266</p>
          </div>

          {/* Subscribe Section */}
          <div className="mb-2">
            <p className="text-med-green mr-1 font-semibold">
              Subscribe
              <span className="text-gray-700"> to get exclusive deals</span>
            </p>
          </div>

          {/* Search Bar and Button */}
          <div className="flex emd:flex-row flex-col items-center gap-3 w-auto">
            <input
              type="text"
              placeholder="Enter your email"
              className="p-2 w-full border border-med-green rounded-md outline-none text-black h-8 focus:border-black transition-all duration-300"
            />
            <button className="bg-med-green text-[0.9rem] px-4 w-full emd:w-auto text-white flex-shrink-0 rounded-md h-8 transition-all duration-300 hover:bg-black">
              Get Deals
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-start space-x-3 mt-4">
            {socialMediaData.map((item, index) => (
              <div
                key={index}
                className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full border p-[6px] border-black transition-all duration-300 hover:bg-black hover:text-white hover:scale-110"
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
      <a
        className="text-[0.8rem] text-gray-600 transition-all duration-300 hover:text-black"
        href="https://gobizdigital.in/"
      >
        powered by Gobiz Digital LLP
      </a>
    </footer>
  );
}

export default Footer;
