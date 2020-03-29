/* eslint-disable import/prefer-default-export */
export const PLACEHOLDER_TEXT = "some text";
export const SHOW_IMAGES = false; // Suppress photos during dev to reduce google charges
export const PLACEHOLDER_TEXT = "Enter a keyword or select a category";
export const NOT_READY_TO_SEARCH =
  "Please specify both a location and a keyword/category to search for";
export const FILTER_LIST = [
  { label: "Restaurants", value: "restaurant", selected: true },
  { label: "Bakeries", value: "bakery", selected: true },
  { label: "Cafes", value: "cafe", selected: true },
  { label: "Churches", value: "church", selected: true },
  { label: "Synagogues", value: "synagogue", selected: true },
  {
    label: "Clothing Stores",
    value: "clothing_store",
    selected: true,
  },
  { label: "Beauty Salons", value: "beauty_salon", selected: true },
  { label: "Hair Care", value: "hair_care", selected: true },
  { label: "Book Stores", value: "book_store", selected: true },
  { label: "Bowling Alleys", value: "bowling_alley", selected: true },
  {
    label: "Grocery/Supermarket",
    value: "grocery_or_supermarket",
    selected: true,
  },
  /*
  { label: "ac,coun,ting", value: "accounting", selected: false },
  { label: "airport", value: "airport", selected: false },
  { label: "amusement_park", value: "amusement_park", selected: false },
  { label: "aquarium", value: "aquarium", selected: false },
  { label: "art_gallery", value: "art_gallery", selected: false },
  { label: "atm", value: "atm", selected: false },
  { label: "bank", value: "bank", selected: false },
  { label: "bar", value: "bar", selected: false },
  { label: "bicycle_store", value: "bicycle_store", selected: false },
  { label: "bus_station", value: "bus_station", selected: false },
  { label: "campground", value: "campground", selected: false },
  { label: "car_dealer", value: "car_dealer", selected: false },
  { label: "car_rental", value: "car_rental", selected: false },
  { label: "car_repair", value: "car_repair", selected: false },
  { label: "car_wash", value: "car_wash", selected: false },
  { label: "casino", value: "casino", selected: false },
  { label: "cemetery", value: "cemetery", selected: false },
  { label: "city_hall", value: "city_hall", selected: false },
  {
    label: "convenience_store",
    value: "convenience_store",
    selected: false
  },
  { label: "courthouse", value: "courthouse", selected: false },
  { label: "dentist", value: "dentist", selected: false },
  {
    label: "department_store",
    value: "department_store",
    selected: false
  },
  { label: "doctor", value: "doctor", selected: false },
  { label: "drugstore", value: "drugstore", selected: false },
  { label: "electrician", value: "electrician", selected: false },
  {
    label: "electronics_store",
    value: "electronics_store",
    selected: false
  },
  { label: "embassy", value: "embassy", selected: false },
  { label: "fire_station", value: "fire_station", selected: false },
  { label: "florist", value: "florist", selected: false },
  { label: "funeral_home", value: "funeral_home", selected: false },
  {
    label: "furniture_store",
    value: "furniture_store",
    selected: false
  },
  { label: "gas_station", value: "gas_station", selected: false },
  { label: "gym", value: "gym", selected: false },
  { label: "hardware_store", value: "hardware_store", selected: false },
  { label: "hindu_temple", value: "hindu_temple", selected: false },
  {
    label: "home_goods_store",
    value: "home_goods_store",
    selected: false
  },
  { label: "hospital", value: "hospital", selected: false },
  {
    label: "insurance_agency",
    value: "insurance_agency",
    selected: false
  },
  { label: "jewelry_store", value: "jewelry_store", selected: false },
  { label: "laundry", value: "laundry", selected: false },
  { label: "lawyer", value: "lawyer", selected: false },
  { label: "library", value: "library", selected: false },
  {
    label: "light_rail_station",
    value: "light_rail_station",
    selected: false
  },
  { label: "liquor_store", value: "liquor_store", selected: false },
  {
    label: "local_government_office",
    value: "local_government_office",
    selected: false
  },
  { label: "locksmith", value: "locksmith", selected: false },
  { label: "lodging", value: "lodging", selected: false },
  { label: "meal_delivery", value: "meal_delivery", selected: false },
  { label: "meal_takeaway", value: "meal_takeaway", selected: false },
  { label: "mosque", value: "mosque", selected: false },
  { label: "movie_rental", value: "movie_rental", selected: false },
  { label: "movie_theater", value: "movie_theater", selected: false },
  { label: "moving_company", value: "moving_company", selected: false },
  { label: "museum", value: "museum", selected: false },
  { label: "night_club", value: "night_club", selected: false },
  { label: "painter", value: "painter", selected: false },
  { label: "park", value: "park", selected: false },
  { label: "parking", value: "parking", selected: false },
  { label: "pet_store", value: "pet_store", selected: false },
  { label: "pharmacy", value: "pharmacy", selected: false },
  {
    label: "physiotherapist",
    value: "physiotherapist",
    selected: false
  },
  { label: "plumber", value: "plumber", selected: false },
  { label: "police", value: "police", selected: false },
  { label: "post_office", value: "post_office", selected: false },
  { label: "primary_school", value: "primary_school", selected: false },
  {
    label: "real_estate_agency",
    value: "real_estate_agency",
    selected: false
  },
  {
    label: "roofing_contractor",
    value: "roofing_contractor",
    selected: false
  },
  { label: "rv_park", value: "rv_park", selected: false },
  { label: "school", value: "school", selected: false },
  {
    label: "secondary_school",
    value: "secondary_school",
    selected: false
  },
  { label: "shoe_store", value: "shoe_store", selected: false },
  { label: "shopping_mall", value: "shopping_mall", selected: false },
  { label: "spa", value: "spa", selected: false },
  { label: "stadium", value: "stadium", selected: false },
  { label: "storage", value: "storage", selected: false },
  { label: "store", value: "store", selected: false },
  { label: "subway_station", value: "subway_station", selected: false },
  { label: "supermarket", value: "supermarket", selected: false },
  { label: "taxi_stand", value: "taxi_stand", selected: false },
  {
    label: "tourist_attraction",
    value: "tourist_attraction",
    selected: false
  },
  { label: "train_station", value: "train_station", selected: false },
  {
    label: "transit_station",
    value: "transit_station",
    selected: false
  },
  { label: "travel_agency", value: "travel_agency", selected: false },
  { label: "university", value: "university", selected: false },
  {
    label: "veterinary_care",
    value: "veterinary_care",
    selected: false
  },
  { label: "zoo", value: "zoo", selected: false }
  */
];
