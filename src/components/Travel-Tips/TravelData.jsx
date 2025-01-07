import { CiMedicalCase } from "react-icons/ci";
import { FaPlaneDeparture, FaShoppingCart } from "react-icons/fa";
import {
  MdAccessTimeFilled,
  MdCurrencyYen,
  MdHealthAndSafety,
} from "react-icons/md";
import CheckSvg from "../../../svgs/CheckSvg";

export const TRAVELTIPSDATA = [
  {
    title: "What to Bring",
    icon: <CheckSvg />,
    desc: "The weight limit on flights is 14kg per person of checked baggage and 7kg of carry-on baggage. Excess baggage, such as guitar and games, are carried on a subject-to-load basis. They are not guaranteed uplift on the same flight as the passenger, but usually do arrive within a day or two, if not the same flight.",
    show: true,
  },
  {
    title: "Transport",
    icon: <FaPlaneDeparture />,
    desc: "You’ll quickly understand why Japan does not need public transport. All accommodation properties meet flights, providing free transport for arriving and departing guests. Walking is a pleasure on the streets of Japan as you’re never far from shops, restaurants, or beaches. There are bicycles and helmets for hire and a limited number of rental cars.",
  },
  {
    title: "Safety",
    icon: <MdHealthAndSafety className="w-5 h-5"/>,
    desc: "Japan is renowned for its safety, boasting low crime rates and a culture that prioritizes order. Travelers can navigate the country confidently by adhering to some basic precautions. Respect local customs, such as bowing and removing shoes indoors. Take advantage of the efficient public transportation system but remain vigilant for pickpockets, especially in crowded areas. Carry cash, as credit cards are not universally accepted, and be aware of the limited availability of ATMs. Stay informed about natural disasters, particularly earthquakes and typhoons, and follow evacuation procedures. Familiarize yourself with traffic rules, as traffic moves on the left side of the road. Show courtesy and respect personal space, as Japanese society values politeness. Overall, Japan provides a secure environment for visitors, but basic awareness and cultural sensitivity enhance the safety and enjoyment of your experience.",
  },
  {
    title: "Medical",
    icon: <CiMedicalCase className="w-5 h-5" />,
    desc: "Japan boasts a comprehensive and advanced healthcare system, ensuring that visitors have access to quality medical facilities and services.\n\nMajor cities, as well as more rural areas, are equipped with hospitals and clinics that maintain high standards of care. In urban centers, healthcare professionals often speak English, facilitating communication for international visitors.\n\nPharmacies, known as \"yakkyoku,\" are widespread and offer a variety of medications. While some Western medications may be available, they might have different brand names in Japan. It's recommended to carry a prescription or know the generic name of any required medications.\n\nHealth insurance is crucial, and visitors should have travel insurance covering medical expenses. Payment at medical facilities is usually in cash, although credit cards are becoming more widely accepted.\n\nFor those in need of English-language services, international medical centers in major cities like Tokyo and Osaka cater specifically to the needs of foreign visitors. In the case of emergencies, the universal emergency services number is 110, covering police, fire, and ambulance services.\n\nOverall, Japan's healthcare system is characterized by efficiency, cleanliness, and a commitment to providing excellent medical care to both residents and visitors.",
  },
  {
    title: "Bank, Credit Card & Money",
    icon: <MdCurrencyYen className="w-5 h-5" />,
    desc: "When traveling to Japan, it's essential to be prepared regarding banking, credit cards, and money matters.\n\nWhile credit cards are widely accepted in major cities, carrying cash is advisable, especially in rural areas where card acceptance may be limited. ATMs are available, but some may not accept foreign cards; however, 7-Eleven and post office ATMs are usually foreign-friendly. Notify your bank of your travel dates to avoid any issues with card transactions.\n\nJapanese currency is the yen (JPY). Currency exchange services are available at airports, banks, and exchange bureaus. Travelers should familiarize themselves with the yen's denominations and carry some coins, particularly for smaller purchases and transportation.\n\nPortable Wi-Fi devices or local SIM cards can facilitate easy access to online banking services and currency conversion apps, enhancing financial convenience during your stay.",
  },
  {
    title: "Shopping",
    icon: <FaShoppingCart />,
    desc: "Japan offers a diverse and unique shopping experience, blending traditional craftsmanship with modern trends. Explore bustling markets like Tokyo's Tsukiji Outer Market for fresh seafood and Asakusa's Nakamise Street for traditional souvenirs. In major cities, department stores like Tokyo's Ginza Mitsukoshi showcase high-end fashion. Harajuku and Shibuya are hubs for trendy and eclectic fashion, while Akihabara caters to tech enthusiasts. Vending machines offer quirky items, and Don Quijote stores provide a wide array of goods. Experience the art of gift-giving with beautifully wrapped items, and don't miss the convenience of tax-free shopping for tourists, available in many stores.",
  },
  {
    title: "Time",
    icon: <MdAccessTimeFilled />,
    desc: "The best time to visit Japan is during spring (late March to early April) for cherry blossoms and mild weather. Autumn (September to November) offers vibrant foliage. Winter (December to February) is ideal for skiing in Hokkaido. Summers (June to August) are warm with festivals. Consider your preferences, with spring being a favorite for its picturesque landscapes and pleasant temperatures.",
  },
];
