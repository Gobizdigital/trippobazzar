export const Destination = {
  description: [
    {
      region: "India",
      destinations: [
        { name: "Kerala" },
        { name: "Leh-Ladakh" },
        { name: "Himachal" },
        { name: "Rajasthan" },
        { name: "Uttarakhand" },
        { name: "Sikkim" },
        { name: "Kashmir" },
        { name: "North Kerala" },
        { name: "Dholavira" },
      ],
    },
    {
      region: "Asia",
      destinations: [{ name: "Vietnam" }, { name: "India" }],
    },
    {
      region: "Australia",
      destinations: [{ name: "Sydney" }],
    },
    {
      region: "Africa",
      destinations: [{ name: "Egypt" }],
    },
    {
      region: "Europe",
      destinations: [{ name: "Georgia" }],
    },
    {
      region: "MiddleEast",
      destinations: [{ name: "SaudiArabia" }],
    },
  ],
};

export const FlatDestinations = Destination.description.flatMap((region) =>
  region.destinations.map((destination) => ({
    region: region.region,
    name: destination.name,
  }))
);

export const NavbarData = [
  {
    title: "My trips",
    description: [{ name: "New packages" }, { name: "Latest Offer" }],
  },
  {
    title: "Whats new",
    description: [{ name: "Fixed Plants" }],
  },
];
