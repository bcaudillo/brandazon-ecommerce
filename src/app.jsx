import React, { useState, useEffect, createContext, useContext } from 'react';

// --- Global Context for Cart Management ---
const CartContext = createContext();

// --- Helper to generate a consistent color based on a string (e.g., category) ---
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// --- Helper to generate a unique base64 SVG placeholder image for each product ---
const generateProductPlaceholderImage = (productName, category) => {
  const bgColor = stringToColor(category || 'default'); // Use category for color
  const textColor = '#FFFFFF'; // White text for better contrast

  // Create a simple SVG string
  const svgString = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="${bgColor}"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="20" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${productName.length > 20 ? productName.substring(0, 17) + '...' : productName}
      </text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        (${category || 'Misc'})
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;base64,' + btoa(svgString);
};

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
    category: 'Holiday',
    sku: 'HOL-ADVENT-001',
    brand: 'FestiveFun',
    variant: 'Standard'
  }
];

// Map product data to include generated image URLs
const productsWithImages = products.map(product => ({
  ...product,
  imageUrl: generateProductPlaceholderImage(product.name, product.category)
}));

// Define a subset of products for the "Featured Products" section on the Home Page
const featuredProducts = productsWithImages.filter(product =>
  product.name.toLowerCase().includes('labubu') || product.category === 'Collectible'
);


// --- Components ---

const Header = ({ navigate, cartItemCount }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brandazon logo now navigates to Moogle */}
        <h1 className="text-3xl font-bold font-inter cursor-pointer" onClick={() => navigate('simulatedSearch')}>Brandazon</h1>
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
          src={generateProductPlaceholderImage("Labubu x Popmart", "Partnership")} // Dynamic placeholder for banner
          alt="Labubu x Popmart Partnership"
          className="w-32 h-32 object-contain rounded-full border-4 border-white shadow-md"
          onError={(e) => { e.target.onerror = null; e.target.src = generateProductPlaceholderImage("Partnership", "Partnership"); }}
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
        onError={(e) => { e.target.onerror = null; e.target.src = generateProductPlaceholderImage(product.name, product.category); }}
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
        {productsWithImages.map((product, index) => ( // Use productsWithImages here
          <ProductCard key={product.id} product={product} navigate={navigate} position={index + 1} />
        ))}
      </div>
    </div>
  );
};

const ProductDetailPage = ({ productId, navigate }) => {
  const [utmParams, setUtmParams] = useState(null); // Keep this state for UTMs
  const { cart, setCart } = useContext(CartContext);

  const product = productsWithImages.find(p => p.id === productId); // Use productsWithImages here

  // Function to get related products
  const getRelatedProducts = (currentProductId, currentProductCategory) => {
    const related = productsWithImages.filter(p =>
      p.id !== currentProductId && p.category === currentProductCategory
    );

    // Shuffle and take up to 4 related products
    const shuffledRelated = related.sort(() => 0.5 - Math.random());
    let selectedRelated = shuffledRelated.slice(0, 4);

    // If not enough related products, fill with random ones from the whole list
    if (selectedRelated.length < 4) {
      const allOtherProducts = productsWithImages.filter(p => p.id !== currentProductId && !selectedRelated.some(rp => rp.id === p.id));
      const shuffledOthers = allOtherProducts.sort(() => 0.5 - Math.random());
      selectedRelated = [...selectedRelated, ...shuffledOthers].slice(0, 4);
    }
    return selectedRelated;
  };

  const relatedProducts = product ? getRelatedProducts(product.id, product.category) : [];


  useEffect(() => {
    // Campaign Attribution Recorded (if UTMs are present) - Now triggered by the ProductDetailPage loading
    // and checking for UTMs, which is a page-specific attribution, not a general "track" event on mount.
    // This is a special case where the "track" event is directly related to the URL state.
    if (window.analytics && product) {
      // Now parse UTMs from window.location.search (before the hash)
      const queryString = window.location.search;
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
      <div className="container mx-auto p-6 text-center text-red-600 text-xl font-semibold">
        Product not found!
        <button
          onClick={() => navigate('products')}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Back to Products
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
        products: [formatProductForSegment(product, 1)]
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-8 gap-8">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = generateProductPlaceholderImage(product.name, product.category); }}
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h2>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <p className="text-5xl font-bold text-purple-700 mb-6">${product.price.toFixed(2)}</p>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg flex-grow"
            >
              Add to Cart
            </button>
            {/* Removed "Remove from Cart" button from here */}
          </div>

          <button
            onClick={() => navigate('products')}
            className="mt-4 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-300 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            ← Back to All Products
          </button>

          {utmParams && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Campaign Attribution Details:</h3>
              <ul className="list-disc list-inside text-blue-700">
                {Object.entries(utmParams).map(([key, value]) => (
                  <li key={key}><strong>{key.replace('utm_', '').replace('_', ' ')}:</strong> {value}</li>
                ))}
              </ul>
              <p className="text-sm text-blue-600 mt-2">
                This information was captured from the URL query parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Related Products You Might Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CartPage = ({ navigate }) => {
  const { cart, setCart } = useContext(CartContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (productId, delta) => {
    const existingItem = cart.find(item => item.id === productId);
    if (!existingItem) return;

    const newQuantity = existingItem.quantity + delta;

    if (newQuantity <= 0) {
      // Remove item if quantity goes to 0 or less
      setCart(cart.filter(item => item.id !== productId));
      if (window.analytics) {
        window.analytics.track('Product Removed', {
          cart_id: 'brandazon_cart_id',
          products: [formatProductForSegment(existingItem, 1)]
        });
      }
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
      // Product Added/Removed for quantity changes
      if (window.analytics) {
        if (delta > 0) {
          window.analytics.track('Product Added', {
            cart_id: 'brandazon_cart_id',
            products: [formatProductForSegment(existingItem, delta)]
          });
        } else {
          window.analytics.track('Product Removed', {
            cart_id: 'brandazon_cart_id',
            products: [formatProductForSegment(existingItem, Math.abs(delta))]
          });
        }
      }
    }
  };

  const handleRemoveItem = (productId) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
      setCart(cart.filter(item => item.id !== productId));
      // Product Removed event for full removal
      if (window.analytics) {
        window.analytics.track('Product Removed', {
          cart_id: 'brandazon_cart_id',
          products: [formatProductForSegment(itemToRemove, itemToRemove.quantity)]
        });
      }
    }
  };

  const handleCheckout = () => {
    // Order Completed event
    if (window.analytics) {
      window.analytics.track('Order Completed', {
        order_id: `order_${Date.now()}`, // Unique order ID
        affiliation: 'Brandazon',
        total: totalPrice,
        revenue: totalPrice,
        shipping: 0, // Assuming free shipping for simplicity
        tax: 0, // Assuming no tax for simplicity
        discount: 0, // Assuming no discount for simplicity
        currency: 'USD',
        products: cart.map(item => formatProductForSegment(item, item.quantity))
      });
    }
    setCart([]); // Clear cart after checkout
    setShowConfirmation(true); // Show confirmation message
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate('home'); // Go back to home after confirmation
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-xl mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('products')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = generateProductPlaceholderImage(item.name, item.category); }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-lg font-bold text-purple-700 w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end items-center mt-8 pt-4 border-t-2 border-gray-200">
            <p className="text-2xl font-bold text-gray-900 mr-4">Total:</p>
            <p className="text-3xl font-extrabold text-purple-800">${totalPrice.toFixed(2)}</p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-8 bg-green-600 text-white py-4 px-6 rounded-lg text-2xl font-semibold hover:bg-green-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-auto">
            <h3 className="text-3xl font-bold text-green-700 mb-4">Order Confirmed!</h3>
            <p className="text-gray-700 text-lg mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
            <button
              onClick={handleCloseConfirmation}
              className="bg-blue-600 text-white py-2 px-5 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SimulatedSearchEnginePage = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Static UTM parameters as per user request
  const utmSource = 'moogle';
  const utmMedium = 'organic';
  const utmCampaign = 'default_search';

  const handleSearch = () => {
    let productToDisplay = null;

    // Try to find a product that matches the search term
    const matchedProducts = productsWithImages.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchedProducts.length > 0) {
      // Pick a random product from the matched list
      const randomIndex = Math.floor(Math.random() * matchedProducts.length);
      productToDisplay = matchedProducts[randomIndex];
    } else {
      // If no match, pick a random product from the entire list
      const randomIndex = Math.floor(Math.random() * productsWithImages.length);
      productToDisplay = productsWithImages[randomIndex];
    }

    // Construct the query string with static UTM parameters
    const queryParams = new URLSearchParams();
    queryParams.append('utm_source', utmSource);
    queryParams.append('utm_medium', utmMedium);
    queryParams.append('utm_campaign', utmCampaign);

    // --- For DISPLAY PURPOSES ONLY in Moogle search results ---
    const simulatedBrandazonDomain = 'https://www.brandazon.com';
    const simulatedProductUrlForDisplay = `${simulatedBrandazonDomain}/product/${productToDisplay.id}?${queryParams.toString()}`;

    setSearchResults([{
      ...productToDisplay,
      simulatedUrl: simulatedProductUrlForDisplay // This is the URL displayed in the search result
    }]);

    // Search Results Viewed event
    if (window.analytics) {
      window.analytics.track('Search Results Viewed', {
        query: searchTerm, // Still log the actual search term for analytics
        results: [{ product_id: productToDisplay.id, product_name: productToDisplay.name }],
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });
    }
  };

  const handleAdClick = (product) => {
    // Product Clicked event (simulating ad click)
    if (window.analytics) {
      window.analytics.track('Product Clicked', {
        ...formatProductForSegment(product), // Use existing formatter
        list: 'Simulated Search Results',
        position: searchResults.findIndex(p => p.id === product.id) + 1,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });
    }
    // Navigate to the product detail page, which will then read the new URL
    // The navigate function will now handle constructing the full URL and pushing state.
    navigate('productDetail', product.id, { fromMoogle: true }); // Pass the flag
  };

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center">
      <h2 className="text-5xl font-extrabold text-gray-900 mb-8 text-center">
        <span className="text-blue-600">M</span>
        <span className="text-red-500">o</span>
        <span className="text-yellow-500">o</span>
        <span className="text-blue-600">g</span>
        <span className="text-green-600">l</span>
        <span className="text-red-500">e</span> Search
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full max-w-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Moogle (e.g., Labubu, Hairbrush, Kettle)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Moogle Search
          </button>
        </div>
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
          <p className="font-semibold">Simulated Ad Parameters (Internal):</p>
          <ul className="list-disc list-inside text-sm">
            <li><strong>UTM Source:</strong> {utmSource}</li>
            <li><strong>UTM Medium:</strong> {utmMedium}</li>
            <li><strong>UTM Campaign:</strong> {utmCampaign}</li>
          </ul>
          <p className="text-sm mt-2">
            Type a search term to find a matching product, or get a random one if no match.
            Click the ad to visit the product page with these UTMs in the URL.
          </p>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Simulated Moogle Ad Result (Click to visit page with UTMs)</h3>
          <div className="space-y-4">
            {searchResults.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 border border-blue-200 hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => handleAdClick(product)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                    onError={(e) => { e.target.onerror = null; e.target.src = generateProductPlaceholderImage(product.name, product.category); }}
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-blue-700 hover:underline">{product.name}</h4>
                    <p className="text-sm text-green-700 mt-1">{product.simulatedUrl}</p> {/* Display the simulated Brandazon URL */}
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
function App() {
  // Set initial page to 'simulatedSearch'
  const [currentPage, setCurrentPage] = useState('simulatedSearch');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [cart, setCart] = useState([]);

  // Function to handle navigation and Segment page calls
  const navigate = (page, productId = null, options = {}) => {
    setCurrentPage(page);
    setCurrentProductId(productId);

    let path = '';
    let properties = {};
    // Start with a clean base URL for constructing the new URL
    const newUrl = new URL(window.location.origin + window.location.pathname);

    // Add UTMs if navigating to product detail from Moogle
    if (page === 'productDetail' && options.fromMoogle) {
      newUrl.searchParams.append('utm_source', 'moogle');
      newUrl.searchParams.append('utm_medium', 'organic');
      newUrl.searchParams.append('utm_campaign', 'default_search');
      newUrl.searchParams.append('from_moogle', 'true'); // Flag for Segment page call
    }

    switch (page) {
      case 'home':
        path = '/';
        properties = { name: 'Home Page' };
        break;
      case 'products':
        path = '/products';
        properties = { name: 'All Products Page' };
        break;
      case 'productDetail':
        path = `/product/${productId}`;
        const product = productsWithImages.find(p => p.id === productId);
        properties = { name: 'Product Detail Page', productId: productId, productName: product?.name };
        break;
      case 'cart':
        path = '/cart';
        properties = { name: 'Shopping Cart Page' };
        break;
      case 'simulatedSearch':
        path = '/simulated-search';
        properties = { name: 'Simulated Search Page' };
        break;
      default:
        path = '/simulated-search'; // Default to simulated search
        properties = { name: 'Simulated Search Page' };
    }

    newUrl.hash = path;
    // Only call pushState here, centralizing URL management
    window.history.pushState({}, '', newUrl.toString());

    // Segment Page call
    if (window.analytics) {
      // Special handling for ProductDetailPage when coming from Moogle
      if (page === 'productDetail' && options.fromMoogle) {
        window.analytics.page('Home Page Viewed', properties); // User's specific request
      } else {
        window.analytics.page(page, properties);
      }
    }
  };

  // Effect to handle initial page load and browser history (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      const fromMoogle = urlParams.get('from_moogle') === 'true';

      let pageToNavigate = 'simulatedSearch'; // Default to simulated search
      let productIdToNavigate = null;

      if (hash.startsWith('#/product/')) {
        productIdToNavigate = hash.replace('#/product/', '');
        pageToNavigate = 'productDetail';
      } else if (hash === '#/products') {
        pageToNavigate = 'products';
      } else if (hash === '#/cart') {
        pageToNavigate = 'cart';
      } else if (hash === '#/simulated-search') {
        pageToNavigate = 'simulatedSearch';
      }

      setCurrentPage(pageToNavigate);
      setCurrentProductId(productIdToNavigate);

      // Manually trigger Segment page call for initial load or browser back/forward
      if (window.analytics) {
        let properties = {};
        const product = productIdToNavigate ? productsWithImages.find(p => p.id === productIdToNavigate) : null;

        switch (pageToNavigate) {
          case 'home':
            properties = { name: 'Home Page' };
            break;
          case 'products':
            properties = { name: 'All Products Page' };
            break;
          case 'productDetail':
            properties = { name: 'Product Detail Page', productId: productIdToNavigate, productName: product?.name };
            break;
          case 'cart':
            properties = { name: 'Shopping Cart Page' };
            break;
          case 'simulatedSearch':
            properties = { name: 'Simulated Search Page' };
            break;
        }

        // Special handling for ProductDetailPage when coming from Moogle via popstate
        if (pageToNavigate === 'productDetail' && fromMoogle) {
          window.analytics.page('Home Page Viewed', properties); // User's specific request
        } else {
          window.analytics.page(pageToNavigate, properties);
        }


        // Also track Product List Viewed for relevant pages on initial load/popstate
        if (pageToNavigate === 'home') {
          window.analytics.track('Promotion Viewed', { // Promotion viewed on Home
            promotion_id: 'labubu_popmart_banner_top',
            creative: 'labubu_x_popmart_banner',
            name: 'Labubu x Popmart Exclusive Partnership',
            position: 'home_banner_top'
          });
          window.analytics.track('Product List Viewed', {
            category: 'Featured Products',
            products: featuredProducts.map((p, index) => formatProductForSegment(p, 1, index + 1))
          });
        } else if (pageToNavigate === 'products') {
          window.analytics.track('Product List Viewed', {
            category: 'All Products',
            products: productsWithImages.map((p, index) => formatProductForSegment(p, 1, index + 1))
          });
        } else if (pageToNavigate === 'cart') {
          window.analytics.track('Cart Viewed', {
            cart_id: 'brandazon_cart_id',
            products: cart.map(item => formatProductForSegment(item, item.quantity))
          });
        }
      }
    };

    // Initial load
    handlePopState();

    // Listen for popstate events (browser back/forward buttons)
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Empty dependency array means this runs once on mount


  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'products':
        return <ProductsPage navigate={navigate} />;
      case 'productDetail':
        return <ProductDetailPage productId={currentProductId} navigate={navigate} />;
      case 'cart':
        return <CartPage navigate={navigate} />;
      case 'simulatedSearch':
        return <SimulatedSearchEnginePage navigate={navigate} />;
      default:
        return <SimulatedSearchEnginePage navigate={navigate} />; // Default to simulated search
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <div className="min-h-screen bg-gray-100 font-inter antialiased">
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Google Fonts - Inter */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
            }
            .min-h-\[calc\(100vh-120px\)\] {
                min-height: calc(100vh - 120px); /* Adjust for header/footer height */
            }
          `}
        </style>

        <Header navigate={navigate} cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="py-8">
          {renderPage()}
        </main>
      </div>
    </CartContext.Provider>
  );
}

export default App;
