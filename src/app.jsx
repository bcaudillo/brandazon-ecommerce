import React, { useState, useEffect, createContext, useContext } from 'react';

// --- Global Context for Cart Management ---
const CartContext = createContext();

// --- Helper to format product data for Segment events ---
const formatProductForSegment = (product, quantity = 1, position = null) => {
  return {
    product_id: product.id,
    sku: product.sku,
    category: product.category,
    name: product.name,
    brand: product.brand,
    variant: product.variant,
    price: product.price,
    quantity: quantity,
    // coupon: product.coupon, // Add if coupons are implemented per product
    position: position,
    url: `${window.location.origin}${window.location.pathname}#/product/${product.id}`, // Dynamic URL
    image_url: product.imageUrl,
  };
};

// --- Expanded Product Data ---
const products = [
  {
    id: 'monopoly-3rd-edition',
    name: 'Monopoly: 3rd Edition',
    description: 'The classic board game of property trading, updated with new tokens and rules for the 3rd edition.',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x300/F0F8FF/000000?text=Monopoly+3rd',
    category: 'Games',
    sku: 'GM-MONO-001',
    brand: 'Hasbro',
    variant: 'Standard'
  },
  {
    id: 'uno-card-game',
    name: 'Uno Card Game',
    description: 'The timeless card game of matching colors and numbers. Easy to pick up, impossible to put down!',
    price: 9.99,
    imageUrl: 'https://placehold.co/300x300/E6E6FA/000000?text=Uno+Cards',
    category: 'Games',
    sku: 'GM-UNO-001',
    brand: 'Mattel',
    variant: 'Standard'
  },
  {
    id: 'special-facial-soap',
    name: 'Special Facial Soap',
    description: 'Gentle and effective facial soap designed for all skin types, leaving your face feeling fresh and clean.',
    price: 12.50,
    imageUrl: 'https://placehold.co/300x300/F5F5DC/000000?text=Facial+Soap',
    category: 'Beauty',
    sku: 'BT-SOAP-001',
    brand: 'PureSkin',
    variant: 'Unscented'
  },
  {
    id: 'fancy-hairbrush',
    name: 'Fancy Hairbrush',
    description: 'Ergonomically designed hairbrush with natural bristles for smooth, tangle-free hair.',
    price: 18.00,
    imageUrl: 'https://placehold.co/300x300/FFF0F5/000000?text=Hairbrush',
    category: 'Beauty',
    sku: 'BT-HBRUSH-001',
    brand: 'GlamLocks',
    variant: 'Large'
  },
  {
    id: 'labubu-blind-box-series-8',
    name: 'Labubu Blind Box Series 8',
    description: 'Discover the magic of Labubu with a surprise figure from Series 8. Collect them all!',
    price: 16.99,
    imageUrl: 'https://placehold.co/300x300/ADD8E6/000000?text=Labubu+Series+8',
    category: 'Collectible',
    sku: 'COL-LABU-S8',
    brand: 'Popmart',
    variant: 'Blind Box'
  },
  {
    id: 'labubu-ghost-hunter-plush',
    name: 'Labubu Ghost Hunter Plush',
    description: 'Cuddly Labubu plush in a spooky ghost hunter outfit. Perfect for fans and collectors.',
    price: 25.00,
    imageUrl: 'https://placehold.co/300x300/B0E0E6/000000?text=Labubu+Ghost',
    category: 'Collectible',
    sku: 'COL-LABU-GH',
    brand: 'Popmart',
    variant: 'Plush'
  },
  {
    id: 'labubu-plush-keychain',
    name: 'Labubu Plush Keychain',
    description: 'Take Labubu with you everywhere with this adorable plush keychain. A small but mighty collectible.',
    price: 9.50,
    imageUrl: 'https://placehold.co/300x300/87CEEB/000000?text=Labubu+Keychain',
    category: 'Collectible',
    sku: 'COL-LABU-KC',
    brand: 'Popmart',
    variant: 'Keychain'
  },
  {
    id: 'electric-pour-over-kettle',
    name: 'Electric Pour-over Kettle',
    description: 'Precision temperature control for the perfect pour-over coffee. Sleek design for any kitchen.',
    price: 59.99,
    imageUrl: 'https://placehold.co/300x300/6495ED/000000?text=Pour-over+Kettle',
    category: 'Kitchen',
    sku: 'KCH-KETTLE-001',
    brand: 'BrewMaster',
    variant: 'Black'
  },
  {
    id: 'retro-gaming-mousepad',
    name: 'Retro Gaming Mousepad',
    description: 'Large mousepad with a nostalgic retro gaming design. Smooth surface for optimal mouse control.',
    price: 14.99,
    imageUrl: 'https://placehold.co/300x300/4682B4/000000?text=Retro+Mousepad',
    category: 'Electronics',
    sku: 'EL-MPAD-001',
    brand: 'GameGear',
    variant: 'Large'
  },
  {
    id: 'airpods-pro-3rd-gen',
    name: 'AirPods Pro 3rd Gen',
    description: 'Immersive sound with active noise cancellation. The latest generation for superior audio experience.',
    price: 249.00,
    imageUrl: 'https://placehold.co/300x300/5F9EA0/000000?text=AirPods+Pro',
    category: 'Electronics',
    sku: 'EL-AIRPODS-003',
    brand: 'Apple',
    variant: 'Pro'
  },
  {
    id: 'nintendo-switch-lite',
    name: 'Nintendo Switch Lite',
    description: 'Compact, lightweight Nintendo Switch system dedicated to handheld play. Perfect for gaming on the go.',
    price: 199.99,
    imageUrl: 'https://placehold.co/300x300/7FFFD4/000000?text=Switch+Lite',
    category: 'Electronics',
    sku: 'GM-SWITCHL-001',
    brand: 'Nintendo',
    variant: 'Yellow'
  },
  {
    id: 'collectible-ceramic-mug',
    name: 'Collectible Ceramic Mug',
    description: 'High-quality ceramic mug with a unique design, perfect for collectors or daily use.',
    price: 11.99,
    imageUrl: 'https://placehold.co/300x300/AFEEEE/000000?text=Ceramic+Mug',
    category: 'Collectible',
    sku: 'COL-MUG-001',
    brand: 'ArtisanCraft',
    variant: 'Standard'
  },
  {
    id: 'summer-splash-towel',
    name: 'Summer Splash Towel',
    description: 'Ultra-absorbent and quick-drying towel, ideal for beach days, pool parties, or gym sessions.',
    price: 19.99,
    imageUrl: 'https://placehold.co/300x300/00CED1/000000?text=Splash+Towel',
    category: 'Home Goods',
    sku: 'HG-TOWEL-001',
    brand: 'AquaDry',
    variant: 'Beach'
  },
  {
    id: 'holiday-cookie-tin',
    name: 'Holiday Cookie Tin',
    description: 'A festive tin filled with an assortment of delicious holiday cookies. Great for gifting!',
    price: 15.00,
    imageUrl: 'https://placehold.co/300x300/40E0D0/000000?text=Cookie+Tin',
    category: 'Food',
    sku: 'FD-COOKIE-001',
    brand: 'SweetTreats',
    variant: 'Assorted'
  },
  {
    id: 'wireless-pet-tracker',
    name: 'Wireless Pet Tracker',
    description: 'Keep track of your furry friend with this compact and reliable wireless pet tracker.',
    price: 45.00,
    imageUrl: 'https://placehold.co/300x300/20B2AA/000000?text=Pet+Tracker',
    category: 'Pet Supplies',
    sku: 'PET-TRACK-001',
    brand: 'PetSafe',
    variant: 'GPS'
  },
  {
    id: 'smart-home-hub-mini',
    name: 'Smart Home Hub Mini',
    description: 'Centralize your smart home devices with this mini hub. Control lights, thermostats, and more.',
    price: 79.99,
    imageUrl: 'https://placehold.co/300x300/3CB371/000000?text=Smart+Hub',
    category: 'Smart Home',
    sku: 'SMART-HUB-001',
    brand: 'ConnectHome',
    variant: 'Mini'
  },
  {
    id: 'mystery-snack-pack',
    name: 'Mystery Snack Pack',
    description: 'A surprise assortment of delicious and unique snacks from around the world. What will you get?',
    price: 10.00,
    imageUrl: 'https://placehold.co/300x300/98FB98/000000?text=Mystery+Snack',
    category: 'Food',
    sku: 'FD-SNACK-001',
    brand: 'GlobalBites',
    variant: 'Assorted'
  },
  {
    id: 'stainless-steel-tumbler',
    name: 'Stainless Steel Tumbler',
    description: 'Double-walled insulated tumbler to keep your drinks hot or cold for hours. Perfect for on-the-go.',
    price: 22.99,
    imageUrl: 'https://placehold.co/300x300/ADFF2F/000000?text=Steel+Tumbler',
    category: 'Home Goods',
    sku: 'HG-TUMBLER-001',
    brand: 'HydratePro',
    variant: '20oz'
  },
  {
    id: 'rechargeable-hand-warmer',
    name: 'Rechargeable Hand Warmer',
    description: 'Stay warm in cold weather with this portable and rechargeable hand warmer. Reusable and eco-friendly.',
    price: 28.00,
    imageUrl: 'https://placehold.co/300x300/7CFC00/000000?text=Hand+Warmer',
    category: 'Outdoor',
    sku: 'OUT-HWARM-001',
    brand: 'WarmHands',
    variant: 'USB'
  },
  {
    id: 'super-soft-throw-blanket',
    name: 'Super Soft Throw Blanket',
    description: 'Luxuriously soft throw blanket, perfect for cozying up on the couch or adding a touch of comfort to any room.',
    price: 35.00,
    imageUrl: 'https://placehold.co/300x300/00FF7F/000000?text=Throw+Blanket',
    category: 'Home Goods',
    sku: 'HG-BLANKET-001',
    brand: 'CozyHome',
    variant: 'Fleece'
  },
  {
    id: 'labubu-golden-edition-figure',
    name: 'Labubu Golden Edition Figure',
    description: 'A rare and exclusive golden edition Labubu figure. A must-have for serious collectors!',
    price: 49.99,
    imageUrl: 'https://placehold.co/300x300/32CD32/000000?text=Labubu+Golden',
    category: 'Collectible',
    sku: 'COL-LABU-GOLD',
    brand: 'Popmart',
    variant: 'Golden'
  },
  {
    id: 'wireless-earbuds-gen2',
    name: 'Wireless Earbuds Gen2',
    description: 'Second generation wireless earbuds with enhanced sound quality and longer battery life.',
    price: 89.99,
    imageUrl: 'https://placehold.co/300x300/228B22/000000?text=Earbuds+Gen2',
    category: 'Electronics',
    sku: 'EL-EARBUDS-002',
    brand: 'AudioPro',
    variant: 'Black'
  },
  {
    id: 'led-desk-lamp-pro',
    name: 'LED Desk Lamp Pro',
    description: 'Adjustable LED desk lamp with multiple brightness and color temperature settings. Perfect for work or study.',
    price: 49.00,
    imageUrl: 'https://placehold.co/300x300/008000/000000?text=Desk+Lamp+Pro',
    category: 'Home Office',
    sku: 'HO-LAMP-001',
    brand: 'BrightDesk',
    variant: 'Pro'
  },
  {
    id: 'ergonomic-office-chair',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable and supportive office chair designed for long hours of work. Promotes good posture.',
    price: 199.00,
    imageUrl: 'https://placehold.co/300x300/006400/000000?text=Office+Chair',
    category: 'Home Office',
    sku: 'HO-OCHAIR-001',
    brand: 'ErgoSit',
    variant: 'Mesh'
  },
  {
    id: 'bluetooth-speaker-splash',
    name: 'Bluetooth Speaker Splash',
    description: 'Waterproof portable Bluetooth speaker with powerful sound. Ideal for outdoor adventures.',
    price: 65.00,
    imageUrl: 'https://placehold.co/300x300/2E8B57/000000?text=Bluetooth+Speaker',
    category: 'Electronics',
    sku: 'EL-SPEAKER-001',
    brand: 'SoundWave',
    variant: 'Waterproof'
  },
  {
    id: 'crystal-growing-kit',
    name: 'Crystal Growing Kit',
    description: 'Fun and educational kit for growing your own beautiful crystals. A great science project for kids.',
    price: 20.00,
    imageUrl: 'https://placehold.co/300x300/3CB371/000000?text=Crystal+Kit',
    category: 'Toys & Hobbies',
    sku: 'TH-CRYSTAL-001',
    brand: 'ScienceFun',
    variant: 'Large'
  },
  {
    id: 'build-your-own-robot-kit',
    name: 'Build-Your-Own Robot Kit',
    description: 'Assemble your own functional robot with this engaging and educational kit. Learn about robotics.',
    price: 75.00,
    imageUrl: 'https://placehold.co/300x300/66CDAA/000000?text=Robot+Kit',
    category: 'Toys & Hobbies',
    sku: 'TH-ROBOT-001',
    brand: 'RoboKids',
    variant: 'Beginner'
  },
  {
    id: 'color-changing-mug',
    name: 'Color-Changing Mug',
    description: 'Watch your mug transform as you pour in hot liquids! A magical addition to your morning routine.',
    price: 14.00,
    imageUrl: 'https://placehold.co/300x300/8FBC8F/000000?text=Color+Mug',
    category: 'Home Goods',
    sku: 'HG-MUG-001',
    brand: 'MagicMugs',
    variant: 'Heat Reveal'
  },
  {
    id: 'fashion-face-mask-3-pack',
    name: 'Fashion Face Mask (3-pack)',
    description: 'Stylish and comfortable reusable face masks. Comes in a pack of three with assorted designs.',
    price: 18.00,
    imageUrl: 'https://placehold.co/300x300/90EE90/000000?text=Face+Masks',
    category: 'Apparel',
    sku: 'APP-MASK-001',
    brand: 'StyleWear',
    variant: 'Assorted'
  },
  {
    id: 'mini-projector-hd',
    name: 'Mini Projector HD',
    description: 'Compact and portable HD projector for movies, presentations, or gaming on the go.',
    price: 120.00,
    imageUrl: 'https://placehold.co/300x300/9ACD32/000000?text=Mini+Projector',
    category: 'Electronics',
    sku: 'EL-PROJECTOR-001',
    brand: 'ViewMax',
    variant: 'HD'
  },
  {
    id: 'doggo-deluxe-bed',
    name: 'Doggo Deluxe Bed',
    description: 'Plush and supportive bed for your beloved canine companion. Provides ultimate comfort.',
    price: 55.00,
    imageUrl: 'https://placehold.co/300x300/6B8E23/000000?text=Dog+Bed',
    category: 'Pet Supplies',
    sku: 'PET-DBED-001',
    brand: 'ComfyPaws',
    variant: 'Large'
  },
  {
    id: 'cat-castle-tower',
    name: 'Cat Castle Tower',
    description: 'Multi-level cat tower with scratching posts, perches, and hideaways for endless feline fun.',
    price: 85.00,
    imageUrl: 'https://placehold.co/300x300/808000/000000?text=Cat+Tower',
    category: 'Pet Supplies',
    sku: 'PET-CTOWER-001',
    brand: 'KittyKingdom',
    variant: 'Multi-level'
  },
  {
    id: 'all-season-yoga-mat',
    name: 'All-Season Yoga Mat',
    description: 'Durable and comfortable yoga mat suitable for all seasons and various types of workouts.',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x300/BDB76B/000000?text=Yoga+Mat',
    category: 'Sports & Fitness',
    sku: 'SF-YOGA-001',
    brand: 'ZenFit',
    variant: 'Standard'
  },
  {
    id: 'travel-packing-cubes',
    name: 'Travel Packing Cubes',
    description: 'Organize your luggage with these versatile packing cubes. Maximize space and minimize wrinkles.',
    price: 24.99,
    imageUrl: 'https://placehold.co/300x300/DAA520/000000?text=Packing+Cubes',
    category: 'Travel',
    sku: 'TRVL-PCUBE-001',
    brand: 'PackSmart',
    variant: 'Set of 3'
  },
  {
    id: 'smart-plant-sensor',
    name: 'Smart Plant Sensor',
    description: 'Monitor your plant\'s health with this smart sensor. Provides data on light, moisture, and nutrients.',
    price: 39.99,
    imageUrl: 'https://placehold.co/300x300/FFD700/000000?text=Plant+Sensor',
    category: 'Smart Home',
    sku: 'SMART-PLANT-001',
    brand: 'GreenThumb',
    variant: 'Basic'
  },
  {
    id: 'pop-culture-puzzle-set',
    name: 'Pop Culture Puzzle Set',
    description: 'Challenging puzzle set featuring iconic pop culture references. Great for movie and TV enthusiasts.',
    price: 22.00,
    imageUrl: 'https://placehold.co/300x300/FFA500/000000?text=Pop+Puzzle',
    category: 'Games',
    sku: 'GM-PUZZLE-001',
    brand: 'NerdPuzzles',
    variant: '1000pc'
  },
  {
    id: 'classic-denim-jacket',
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket, a versatile wardrobe staple for any season. Available in various washes.',
    price: 69.00,
    imageUrl: 'https://placehold.co/300x300/FF8C00/000000?text=Denim+Jacket',
    category: 'Apparel',
    sku: 'APP-DENIM-001',
    brand: 'FashionCo',
    variant: 'Blue'
  },
  {
    id: 'pocket-blender-pro',
    name: 'Pocket Blender Pro',
    description: 'Compact and powerful personal blender, perfect for smoothies on the go. Rechargeable battery.',
    price: 39.99,
    imageUrl: 'https://placehold.co/300x300/FF4500/000000?text=Pocket+Blender',
    category: 'Kitchen',
    sku: 'KCH-PBLEND-001',
    brand: 'BlendGo',
    variant: 'Pro'
  },
  {
    id: 'microfiber-cleaning-slippers',
    name: 'Microfiber Cleaning Slippers',
    description: 'Clean your floors effortlessly while you walk with these innovative microfiber cleaning slippers.',
    price: 15.00,
    imageUrl: 'https://placehold.co/300x300/FF6347/000000?text=Cleaning+Slippers',
    category: 'Home Goods',
    sku: 'HG-SLIPPER-001',
    brand: 'CleanFeet',
    variant: 'Grey'
  },
  {
    id: 'personal-blender-bottle',
    name: 'Personal Blender Bottle',
    description: 'A convenient blender bottle for quick shakes and smoothies. Easy to clean and portable.',
    price: 25.00,
    imageUrl: 'https://placehold.co/300x300/CD5C5C/000000?text=Blender+Bottle',
    category: 'Kitchen',
    sku: 'KCH-BOTTLE-001',
    brand: 'ShakeIt',
    variant: '24oz'
  },
  {
    id: 'wireless-charging-pad',
    name: 'Wireless Charging Pad',
    description: 'Fast and efficient wireless charging pad for compatible smartphones and devices.',
    price: 29.00,
    imageUrl: 'https://placehold.co/300x300/DC143C/000000?text=Charging+Pad',
    category: 'Electronics',
    sku: 'EL-CHARGE-001',
    brand: 'PowerUp',
    variant: 'Fast'
  },
  {
    id: 'kitchen-chef-knife-set',
    name: 'Kitchen Chef Set',
    description: 'Professional-grade chef knife set with essential knives for every culinary task. High-quality steel.',
    price: 89.99,
    imageUrl: 'https://placehold.co/300x300/B22222/000000?text=Knife+Set',
    category: 'Kitchen',
    sku: 'KCH-KNIFE-001',
    brand: 'ChefPro',
    variant: '5-piece'
  },
  {
    id: 'instant-cold-brew-maker',
    name: 'Instant Cold Brew Maker',
    description: 'Make delicious cold brew coffee at home in minutes with this easy-to-use instant maker.',
    price: 34.99,
    imageUrl: 'https://placehold.co/300x300/8B0000/000000?text=Cold+Brew+Maker',
    category: 'Kitchen',
    sku: 'KCH-COLDBREW-001',
    brand: 'BrewQuick',
    variant: 'Standard'
  },
  {
    id: 'uv-sanitizing-box',
    name: 'UV Sanitizing Box',
    description: 'Sterilize your phone, keys, and other small items with powerful UV-C light. Keep germs at bay.',
    price: 49.99,
    imageUrl: 'https://placehold.co/300x300/A52A2A/000000?text=UV+Sanitizer',
    category: 'Health & Personal Care',
    sku: 'HPC-UVSAN-001',
    brand: 'CleanTech',
    variant: 'Compact'
  },
  {
    id: 'portable-fire-pit',
    name: 'Portable Fire Pit',
    description: 'Enjoy cozy evenings outdoors with this compact and easy-to-assemble portable fire pit.',
    price: 79.00,
    imageUrl: 'https://placehold.co/300x300/D2B48C/000000?text=Fire+Pit',
    category: 'Outdoor',
    sku: 'OUT-FIREPIT-001',
    brand: 'CampFire',
    variant: 'Portable'
  },
  {
    id: 'commuter-insulated-backpack',
    name: 'Commuter Insulated Backpack',
    description: 'Keep your food and drinks cool on the go with this stylish and insulated commuter backpack.',
    price: 59.00,
    imageUrl: 'https://placehold.co/300x300/F4A460/000000?text=Insulated+Backpack',
    category: 'Travel',
    sku: 'TRVL-BPACK-001',
    brand: 'GoPack',
    variant: 'Insulated'
  },
  {
    id: 'labubu-vampire-bunny-plush',
    name: 'Labubu Vampire Bunny Plush',
    description: 'A special edition Labubu plush, dressed as a charming vampire bunny. Spooky and cute!',
    price: 28.00,
    imageUrl: 'https://placehold.co/300x300/FF7F50/000000?text=Labubu+Vampire',
    category: 'Collectible',
    sku: 'COL-LABU-VAMP',
    brand: 'Popmart',
    variant: 'Vampire'
  },
  {
    id: 'labubu-sweet-dream-figure',
    name: 'Labubu Sweet Dream Figure',
    description: 'A delightful Labubu figure depicting a sweet dream scene. Perfect for display.',
    price: 17.50,
    imageUrl: 'https://placehold.co/300x300/FF69B4/000000?text=Labubu+Sweet+Dream',
    category: 'Collectible',
    sku: 'COL-LABU-SD',
    brand: 'Popmart',
    variant: 'Sweet Dream'
  },
  {
    id: 'labubu-trick-or-treat-series',
    name: 'Labubu Trick-or-Treat Series',
    description: 'Get into the Halloween spirit with the Labubu Trick-or-Treat blind box series. Collect all the ghoulishly cute figures!',
    price: 16.99,
    imageUrl: 'https://placehold.co/300x300/FF1493/000000?text=Labubu+Trick',
    category: 'Collectible',
    sku: 'COL-LABU-TOT',
    brand: 'Popmart',
    variant: 'Halloween'
  },
  {
    id: 'marvel-collector-keychain',
    name: 'Marvel Collector Keychain',
    description: 'Officially licensed Marvel collectible keychain. Choose your favorite superhero!',
    price: 7.99,
    imageUrl: 'https://placehold.co/300x300/C71585/000000?text=Marvel+Keychain',
    category: 'Collectible',
    sku: 'COL-MARVEL-KC',
    brand: 'Marvel',
    variant: 'Assorted'
  },
  {
    id: 'holiday-advent-calendar',
    name: 'Holiday Advent Calendar',
    description: 'Count down to the holidays with a surprise treat or toy each day. A festive way to celebrate!',
    price: 25.00,
    imageUrl: 'https://placehold.co/300x300/DB7093/000000?text=Advent+Calendar',
    category: 'Holiday',
    sku: 'HOL-ADVENT-001',
    brand: 'FestiveFun',
    variant: 'Standard'
  }
];

// Define a subset of products for the "Featured Products" section on the Home Page
const featuredProducts = products.filter(product =>
  product.name.toLowerCase().includes('labubu') || product.category === 'Collectible'
);


// --- Components ---

const Header = ({ navigate, cartItemCount }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter cursor-pointer" onClick={() => navigate('home')}>Brandazon</h1>
        <nav className="flex items-center space-x-6">
          <button
            onClick={() => navigate('home')}
            className="text-lg hover:text-purple-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </button>
          <button
            onClick={() => navigate('products')}
            className="text-lg hover:text-purple-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Products
          </button>
          <button
            onClick={() => navigate('simulatedSearch')}
            className="text-lg hover:text-purple-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Simulate Ad
          </button>
          <button
            onClick={() => navigate('cart')}
            className="relative text-lg hover:text-purple-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Cart ({cartItemCount})
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

const PartnershipBanner = () => {
  // Removed Promotion Viewed event from useEffect, now only triggered by click
  const handleShopNowClick = () => {
    // Promotion Clicked event
    if (window.analytics) {
      window.analytics.track('Promotion Clicked', {
        promotion_id: 'labubu_popmart_banner_top',
        creative: 'labubu_x_popmart_banner',
        name: 'Labubu x Popmart Exclusive Partnership',
        position: 'home_banner_top'
      });
    }
    // In a real app, this would navigate to a specific Labubu category page or product list
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-4 rounded-xl shadow-lg mb-12 text-center transform transition duration-500 hover:scale-102">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
        <img
          src="https://placehold.co/150x150/FFFFFF/FF69B4?text=Labubu+x+Popmart"
          alt="Labubu x Popmart Partnership"
          className="w-32 h-32 object-contain rounded-full border-4 border-white shadow-md"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/CCCCCC/000000?text=Partnership`; }}
        />
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
            <span className="block">Brandazon x Labubu</span>
            <span className="block text-2xl md:text-3xl font-semibold mt-1">Exclusive Partnership with Popmart!</span>
          </h2>
          <p className="text-lg md:text-xl font-medium opacity-90">
            Discover the latest Labubu drops and limited editions, only here.
          </p>
          <button
            onClick={handleShopNowClick}
            className="mt-6 bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 hover:text-purple-800 transition duration-300 transform hover:scale-105"
          >
            Shop Labubu Now!
          </button>
        </div>
      </div>
    </div>
  );
};


const ProductCard = ({ product, navigate, position }) => {
  const { cart, setCart } = useContext(CartContext);

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    // Product Added event
    if (window.analytics) {
      window.analytics.track('Product Added', {
        cart_id: 'brandazon_cart_id', // Placeholder cart ID
        products: [formatProductForSegment(product, 1)] // Always add 1 unit per click
      });
    }
  };

  const handleViewDetails = () => {
    // Product Clicked event
    if (window.analytics) {
      window.analytics.track('Product Clicked', formatProductForSegment(product, 1, position));
    }
    // Product Viewed event - Triggered by button click, not just component mount
    if (window.analytics) {
      window.analytics.track('Product Viewed', {
        product_id: product.id,
        sku: product.sku,
        category: product.category,
        name: product.name,
        brand: product.brand,
        variant: product.variant,
        price: product.price,
        quantity: 1,
        currency: 'USD',
        value: product.price,
        url: `${window.location.origin}${window.location.pathname}#/product/${product.id}`,
        image_url: product.imageUrl,
      });
    }
    navigate('productDetail', product.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/CCCCCC/000000?text=Image+Not+Found`; }}
      />
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
          <p className="text-2xl font-bold text-purple-700 mb-4">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleViewDetails}
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ navigate }) => {
  // Removed Product List Viewed event from useEffect
  return (
    <div className="container mx-auto p-6">
      <PartnershipBanner />
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Featured Labubu & Popmart Collectibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} navigate={navigate} position={index + 1} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={() => navigate('products')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};

const ProductsPage = ({ navigate }) => {
  // Removed Product List Viewed event from useEffect
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} navigate={navigate} position={index + 1} />
        ))}
      </div>
    </div>
  );
};

const ProductDetailPage = ({ productId, navigate }) => {
  const [utmParams, setUtmParams] = useState(null); // Keep this state for UTMs
  const { cart, setCart } = useContext(CartContext);

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    // Campaign Attribution Recorded (if UTMs are present) - Now triggered by the ProductDetailPage loading
    // and checking for UTMs, which is a page-specific attribution, not a general "track" event on mount.
    // This is a special case where the "track" event is directly related to the URL state.
    if (window.analytics && product) {
      const hashParts = window.location.hash.split('?');
      const queryString = hashParts.length > 1 ? hashParts[1] : '';
      const params = new URLSearchParams(queryString);

      const parsedUtm = {};
      for (let [key, value] of params.entries()) {
        if (key.startsWith('utm_') || key.startsWith('gad_') || key.startsWith('gclid') || key.startsWith('gbraid')) {
          parsedUtm[key] = value;
        }
      }

      if (Object.keys(parsedUtm).length > 0) {
        setUtmParams(parsedUtm); // Update state with parsed UTMs
        window.analytics.track('Campaign Attribution Recorded', {
          product_id: product.id,
          product_name: product.name,
          ...parsedUtm
        });
      } else {
        setUtmParams(null); // Clear if no UTMs are present
      }
    }
  }, [productId, product]); // Depend on productId and product only for this effect

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Back to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    // Product Added event
    if (window.analytics) {
      window.analytics.track('Product Added', {
        cart_id: 'brandazon_cart_id', // Placeholder cart ID
        products: [formatProductForSegment(product, 1)] // Always add 1 unit per click
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-1/2 lg:w-1/3 h-auto object-cover rounded-lg shadow-md"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/CCCCCC/000000?text=Image+Not+Found`; }}
        />
        <div className="flex-grow">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h2>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <p className="text-4xl font-bold text-purple-700 mb-6">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="bg-purple-600 text-white py-3 px-8 rounded-lg text-xl font-semibold hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate('home')}
            className="ml-4 bg-gray-300 text-gray-800 py-3 px-8 rounded-lg text-xl font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ navigate }) => {
  const { cart, setCart } = useContext(CartContext);

  // Removed Cart Viewed event from useEffect
  // It's generally better to track Cart Viewed as part of a page() call or
  // only when the user explicitly interacts with the cart (e.g., clicks a "View Cart" button)

  const updateQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      // Product Removed event
      if (window.analytics) {
        window.analytics.track('Product Removed', {
          cart_id: 'brandazon_cart_id',
          products: [formatProductForSegment(item, item.quantity)] // Track original quantity being removed
        });
      }
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      ));
      if (delta > 0) {
        // Product Added event (for quantity increase)
        if (window.analytics) {
          window.analytics.track('Product Added', {
            cart_id: 'brandazon_cart_id',
            products: [formatProductForSegment(item, 1)] // Track 1 unit added
          });
        }
      } else {
        // Product Removed event (for quantity decrease)
        if (window.analytics) {
          window.analytics.track('Product Removed', {
            cart_id: 'brandazon_cart_id',
            products: [formatProductForSegment(item, 1)] // Track 1 unit removed
          });
        }
      }
    }
  };

  const removeItem = (id) => {
    const itemToRemove = cart.find(item => item.id === id);
    if (itemToRemove) {
      // Product Removed event (for full item removal)
      if (window.analytics) {
        window.analytics.track('Product Removed', {
          cart_id: 'brandazon_cart_id',
          products: [formatProductForSegment(itemToRemove, itemToRemove.quantity)]
        });
      }
      setCart(cart.filter(item => item.id !== id));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Checkout Started event
    if (window.analytics) {
      window.analytics.track('Checkout Started', {
        order_id: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate a unique order_id
        affiliation: 'Brandazon Online Store',
        value: totalAmount,
        revenue: totalAmount, // Assuming no separate discounts/taxes for simplicity here
        shipping: 0, // Placeholder
        tax: 0,      // Placeholder
        discount: 0, // Placeholder
        currency: 'USD',
        products: cart.map(item => formatProductForSegment(item, item.quantity))
      });
    }
    navigate('checkout');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          Your cart is empty. <button onClick={() => navigate('home')} className="text-blue-600 hover:underline">Start shopping!</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/CCCCCC/000000?text=Img`; }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xl font-bold text-purple-700 w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-2xl font-bold text-gray-900 mr-4">Total:</p>
            <p className="text-3xl font-extrabold text-purple-800">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => navigate('home')}
              className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg
                  ${cart.length === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ navigate }) => {
  const { cart, setCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // Placeholder for user ID - In a real app, this would come from an auth system
    const userId = 'user_12345';
    const userTraits = {
      email: 'user@example.com',
      name: 'John Doe',
    };

    // Identify call on checkout page load (or when user logs in/is identified)
    if (window.analytics) {
      window.analytics.identify(userId, userTraits);
    }

    // Removed Checkout Step Viewed event from useEffect
  }, []); // Only on mount

  const handlePlaceOrder = () => {
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const revenue = totalAmount;
    const shipping = 0;
    const tax = 0;
    const discount = 0;
    const coupon = 'N/A';

    // Payment Info Entered event (simulated before Order Completed)
    if (window.analytics) {
      window.analytics.track('Payment Info Entered', {
        checkout_id: 'brandazon_checkout_id',
        order_id: orderId,
        payment_method: 'Credit Card' // Placeholder
      });
    }

    // Order Completed event
    if (window.analytics) {
      window.analytics.track('Order Completed', {
        checkout_id: 'brandazon_checkout_id',
        order_id: orderId,
        affiliation: 'Brandazon Online Store',
        total: totalAmount + shipping + tax - discount,
        subtotal: totalAmount,
        revenue: revenue,
        shipping: shipping,
        tax: tax,
        discount: discount,
        coupon: coupon,
        currency: 'USD',
        products: cart.map(item => formatProductForSegment(item, item.quantity))
      });
    }

    setOrderPlaced(true);
    setCart([]); // Clear cart after purchase
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h2>
      <div className="bg-white rounded-xl shadow-lg p-8">
        {orderPlaced ? (
          <div className="text-center text-green-700 text-2xl font-semibold">
            <p className="mb-4">🎉 Your order has been placed successfully!</p>
            <p>Thank you for shopping with Brandazon!</p>
            <button
              onClick={() => navigate('home')}
              className="mt-8 bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
              {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty. Please add items before checking out.</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between text-gray-700 text-lg">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-gray-900 mr-4">Total:</p>
                <p className="text-3xl font-extrabold text-purple-800">${totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Shipping Information</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                  <input type="text" id="fullName" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                  <input type="text" id="address" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City</label>
                    <input type="text" id="city" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Anytown" required />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-gray-700 text-sm font-bold mb-2">Zip Code</label>
                    <input type="text" id="zip" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="12345" required />
                  </div>
                </div>
              </form>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Payment Information</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                  <input type="text" id="cardNumber" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="**** **** **** ****" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">Expiry Date (MM/YY)</label>
                    <input type="text" id="expiryDate" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="12/25" required />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                    <input type="text" id="cvv" className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="123" required />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('cart')}
                className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-400 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Back to Cart
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className={`py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg
                  ${cart.length === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
};

const SimulatedSearchEnginePage = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Page view for Simulated Search Engine (this is a page, not a track event on mount)
    if (window.analytics) {
      window.analytics.page('Marketing', 'Simulated Search Engine Page', {
        path: window.location.pathname + window.location.hash,
        url: window.location.href
      });
    }
  }, []);

  const handleAdClick = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let targetProductId = 'labubu-blind-box-series-8'; // Default Labubu product

    const matchedProduct = products.find(p =>
      p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.category.toLowerCase().includes(lowerCaseSearchTerm)
    );

    if (matchedProduct) {
      targetProductId = matchedProduct.id;
    }

    // Products Searched event (triggered by click)
    if (window.analytics) {
      window.analytics.track('Products Searched', {
        query: searchTerm.trim()
      });
    }

    // Construct the query parameters string
    const queryParams = new URLSearchParams();
    queryParams.append('utm_source', 'google');
    queryParams.append('utm_medium', 'cpc');
    queryParams.append('utm_campaign', 'labubu_launch_q3');
    queryParams.append('utm_content', 'search_ad_banner');
    queryParams.append('utm_term', searchTerm.trim() || 'default_search_term');
    queryParams.append('gad_source', '1');
    queryParams.append('gad_campaignid', '22690431292');
    queryParams.append('gbraid', '0AAAAApZoGaVNZnuRe968aNy6x-Z4Y9TI6');
    queryParams.append('gclid', 'CjwKCAjw1ozEBhAdEiwAn9qbzT99fJagIv7foNLlQnHysh63ZqtvIRL_hVhVDsUw_948_5Hs1WQu-BoCZCYQAvD_BwE'); // Example GCLID

    const baseUrl = window.location.origin + window.location.pathname;
    const constructedUrl = `${baseUrl}#/product/${targetProductId}?${queryParams.toString()}`;

    window.location.href = constructedUrl;
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Simulate a Search Engine Ad</h2>
        <p className="text-gray-700 text-lg mb-6">
          Type a search query below and click "Simulate Ad Click" to see how UTM parameters would be passed to Brandazon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-grow shadow appearance-none border rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Labubu, Earbuds, Monopoly"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAdClick(); }}
          />
          <button
            onClick={handleAdClick}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Simulate Ad Click
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          (This will change the URL in your browser's address bar and navigate to the product page.)
        </p>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  // We'll manage routing based on window.location.hash directly
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState([]);

  // Effect to handle initial page load and hash changes for routing and Segment page calls
  useEffect(() => {
    const handleNavigationAndTracking = () => {
      const hash = window.location.hash;
      let pageName = '';
      let pageCategory = '';
      let currentProductId = null; // To store product ID if on product detail page

      if (hash.startsWith('#/product/')) {
        const productIdFromHash = hash.split('?')[0].replace('#/product/', '');
        setCurrentPage('productDetail');
        currentProductId = productIdFromHash;
        setSelectedProductId(productIdFromHash);
        pageName = 'Product Detail Page';
        pageCategory = 'E-commerce';
      } else if (hash === '#/products') {
        setCurrentPage('products');
        setSelectedProductId(null);
        pageName = 'All Products Page';
        pageCategory = 'E-commerce';
      } else if (hash === '#/simulatedSearch') {
        setCurrentPage('simulatedSearch');
        setSelectedProductId(null);
        pageName = 'Simulated Search Engine Page';
        pageCategory = 'Marketing';
      } else if (hash === '#/cart') {
        setCurrentPage('cart');
        setSelectedProductId(null);
        pageName = 'Cart Page';
        pageCategory = 'E-commerce';
      } else if (hash === '#/checkout') {
        setCurrentPage('checkout');
        setSelectedProductId(null);
        pageName = 'Checkout Page';
        pageCategory = 'E-commerce';
      }
      else {
        setCurrentPage('home');
        setSelectedProductId(null);
        pageName = 'Home Page';
        pageCategory = 'E-commerce';
      }

      // Segment Page call for every route change, including initial load after refresh
      if (window.analytics) {
        window.analytics.page(pageCategory, pageName, {
          path: window.location.pathname + window.location.hash,
          url: window.location.href,
          // Add product_id to page properties if on product detail page
          ...(currentProductId && { product_id: currentProductId })
        });
      }
    };

    // Set initial page and trigger Segment page call on component mount (after refresh)
    handleNavigationAndTracking();

    // Listen for hash changes for subsequent in-app navigation
    window.addEventListener('hashchange', handleNavigationAndTracking);

    // Cleanup listener
    return () => {
      window.removeEventListener('hashchange', handleNavigationAndTracking);
    };
  }, []); // Run once on mount

  // Placeholder for initial user identification (e.g., on first load or after login)
  useEffect(() => {
    const anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      const newAnonymousId = `anon-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem('anonymousId', newAnonymousId);
      if (window.analytics) {
        window.analytics.identify(newAnonymousId);
      }
    } else {
      if (window.analytics) {
        window.analytics.identify(anonymousId);
      }
    }

    if (window.analytics) {
      window.analytics.track('Application Loaded');
    }

  }, []);


  // Internal navigation function (for internal app links)
  const navigate = (page, productId = null) => {
    let newHash = '';
    switch (page) {
      case 'home':
        newHash = ''; // Empty hash for home
        break;
      case 'products':
        newHash = '#/products';
        break;
      case 'simulatedSearch':
        newHash = '#/simulatedSearch';
        break;
      case 'productDetail':
        newHash = `#/product/${productId}`;
        break;
      case 'cart':
        newHash = '#/cart';
        break;
      case 'checkout':
        newHash = '#/checkout';
        break;
      default:
        newHash = '';
    }
    window.location.hash = newHash; // Update hash, which will trigger handleNavigationAndTracking
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    // Provide the cart context to all child components
    <CartContext.Provider value={{ cart, setCart }}>
      <div className="min-h-screen bg-gray-100 font-inter antialiased">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        <Header navigate={navigate} cartItemCount={cartItemCount} />
        <main className="py-8">
          {(() => {
            switch (currentPage) {
              case 'home':
                return <HomePage navigate={navigate} />;
              case 'products':
                return <ProductsPage navigate={navigate} />;
              case 'simulatedSearch':
                return <SimulatedSearchEnginePage products={products} />; // Pass products to SimulatedSearchEnginePage
              case 'productDetail':
                // ProductDetailPage now reads its own productId and UTMs from the URL
                return <ProductDetailPage productId={selectedProductId} navigate={navigate} />;
              case 'cart':
                return <CartPage navigate={navigate} />;
              case 'checkout':
                return <CheckoutPage navigate={navigate} />;
              default:
                return <HomePage navigate={navigate} />;
            }
          })()}
        </main>
      </div>
    </CartContext.Provider>
  );
};

export default App;
