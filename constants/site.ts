export const SITE_CONFIG = {
  name: "ACCITC",
  description: "Official website of Adamjee Cantonment College IT Club",
  email: "itclub@acc.edu.bd",
  phone: "02-8872446",
  address: {
    line1: "Shaheed Sharani",
    // line2: "Dhaka Cantonment",
    city: "Dhaka",
    // state: "Dhaka",
    country: "Bangladesh",
    zip: "1206",
  },
  groupChats: {
    messenger: process.env.NEXT_PUBLIC_MESSENGER_GROUP_LINK || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_GROUP_LINK || "",
  },
};
