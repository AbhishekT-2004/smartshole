import { Product, Review, Order, Coupon } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-nike-air-jordan-1',
    name: 'Air Jordan 1 Retro High OG "Chicago Lost & Found"',
    brand: 'Nike',
    category: 'Sneakers',
    gender: 'Men',
    price: 13999,
    originalPrice: 18999,
    discountPercent: 26,
    rating: 4.8,
    ratingCount: 2480,
    reviewCount: 612,
    isAssured: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 4 },
      { size: 7, stock: 8 },
      { size: 8, stock: 15 },
      { size: 9, stock: 3 },
      { size: 10, stock: 9 },
      { size: 11, stock: 2 }
    ],
    colors: ['Varsity Red / Black / Sail', 'Shadow Grey', 'Royal Blue'],
    description: 'The Air Jordan 1 Retro High OG brings back the beloved silhouette with vintage aesthetics, cracked leather accents, and the timeless Chicago colorway that defined basketball sneaker culture since 1985.',
    highlights: [
      'Iconic high-top profile with padded ankle collar',
      'Encapsulated Nike Air unit in the heel for lightweight impact absorption',
      'Solid rubber cupsole with deep flex grooves and concentric traction rings',
      'Premium aged full-grain leather upper with vintage cracked collar finish',
      'Flipkart KickAssure 100% Originality Guarantee with tamper-evident seal'
    ],
    specifications: {
      soleMaterial: 'Vulcanized Rubber',
      upperMaterial: 'Full-Grain Genuine Leather',
      fastening: 'Lace-Up with Extra Laces Included',
      weight: '430g (per UK 8)',
      cushioning: 'Encapsulated Nike Air-Sole',
      origin: 'Vietnam',
      warranty: '6 Months Brand Warranty against manufacturing defects',
      care: 'Wipe gently with damp cloth. Use sneaker cleaner foam for deep cleaning.'
    },
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'prod-adidas-ultraboost-light',
    name: 'Ultraboost Light 23 Running Shoes',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Men',
    price: 9499,
    originalPrice: 17999,
    discountPercent: 47,
    rating: 4.7,
    ratingCount: 3120,
    reviewCount: 780,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 7 },
      { size: 7, stock: 12 },
      { size: 8, stock: 18 },
      { size: 9, stock: 14 },
      { size: 10, stock: 6 },
      { size: 11, stock: 1 }
    ],
    colors: ['Core Black / Solar Red', 'Cloud White', 'Lucid Blue'],
    description: 'Experience epic energy with the lightest Ultraboost ever made. Featuring Light BOOST technology that delivers unmatched energy return and Continental™ Better Rubber outsole for superior wet-or-dry grip.',
    highlights: [
      '30% lighter BOOST midsole formulation with explosive spring',
      'Linear Energy Push (LEP) system integrated with the sole for propulsion',
      'Primeknit+ FORGED textile upper that adapts to foot volume during runs',
      'Continental™ Better Rubber compound delivers 32% extra traction',
      'Made with at least 50% recycled materials in the upper'
    ],
    specifications: {
      soleMaterial: 'Continental™ Grip Rubber',
      upperMaterial: 'Primeknit+ Engineered Mesh',
      fastening: 'Adaptive Lace-Up',
      weight: '293g (UK 8.5)',
      cushioning: 'Light BOOST Foam Compound',
      origin: 'Indonesia',
      warranty: '3 Months Brand Warranty',
      care: 'Machine washable in cold water with wash bag, air dry in shade.'
    },
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'prod-puma-nitro-velocity',
    name: 'Velocity NITRO 3 Road Running Shoes',
    brand: 'Puma',
    category: 'Running',
    gender: 'Unisex',
    price: 5299,
    originalPrice: 10999,
    discountPercent: 51,
    rating: 4.6,
    ratingCount: 1820,
    reviewCount: 340,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 5 },
      { size: 7, stock: 10 },
      { size: 8, stock: 12 },
      { size: 9, stock: 7 },
      { size: 10, stock: 4 },
      { size: 11, stock: 0 }
    ],
    colors: ['Fast Yellow / Fire Red', 'Puma Black', 'Electric Blue'],
    description: 'The industry-lauded workhorse of performance running. NITRO™ advanced nitrogen-infused foam creates featherlight bounce and high response for long distances and 5K sprints alike.',
    highlights: [
      'NITROFOAM™ innovative nitrogen-injected midsole for high rebound',
      'PUMAGRIP all-surface rubber outsole tested across tarmac and gravel',
      'Engineered mesh upper with targeted PWRTAPE reinforcements',
      'TPU heel spoiler providing stability and clean stride alignment',
      'Reflective accents for high-visibility night running'
    ],
    specifications: {
      soleMaterial: 'PUMAGRIP Durable Rubber',
      upperMaterial: 'Engineered Breathable Mesh',
      fastening: 'Classic Lace-Up',
      weight: '264g',
      cushioning: 'Nitrogen-Infused NITRO Foam',
      origin: 'Vietnam',
      warranty: '3 Months Brand Warranty',
      care: 'Clean with soft bristle brush. Do not bleach or soak.'
    },
    createdAt: '2026-01-20T08:00:00.000Z'
  },
  {
    id: 'prod-nb-9060-drift',
    name: '9060 Lifestyle Chunky Y2K Sneakers',
    brand: 'New Balance',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 11999,
    originalPrice: 15999,
    discountPercent: 25,
    rating: 4.9,
    ratingCount: 1540,
    reviewCount: 420,
    isAssured: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 2 },
      { size: 7, stock: 5 },
      { size: 8, stock: 11 },
      { size: 9, stock: 16 },
      { size: 10, stock: 8 },
      { size: 11, stock: 3 }
    ],
    colors: ['Rain Cloud Grey', 'Sea Salt White', 'Castlerock Navy'],
    description: 'The 9060 reinterprets familiar elements sourced from classic 99X models with a warped sensibility inspired by the futuristic, visible tech aesthetic of the Y2K era.',
    highlights: [
      'Dual-density midsole featuring ABZORB and SBS cushioning',
      'Diamond outsole pattern inspired by classic 860 design',
      'Tongue logo inspired by original 991 lace jewel',
      'Translucent CR device at heel for dimensional architectural flair',
      'Combination premium pigskin suede and airy mesh panels'
    ],
    specifications: {
      soleMaterial: 'Sculpted Pod Rubber Outsole',
      upperMaterial: 'Premium Suede & Breathable Mesh',
      fastening: 'Lace-Up',
      weight: '410g',
      cushioning: 'ABZORB & SBS Dual Pods',
      origin: 'China',
      warranty: '6 Months Brand Warranty',
      care: 'Use suede brush and waterproofing protector spray.'
    },
    createdAt: '2026-02-10T14:30:00.000Z'
  },
  {
    id: 'prod-converse-chuck-70',
    name: 'Chuck 70 Vintage Canvas High-Top',
    brand: 'Converse',
    category: 'High-Tops',
    gender: 'Unisex',
    price: 3999,
    originalPrice: 5999,
    discountPercent: 33,
    rating: 4.8,
    ratingCount: 5200,
    reviewCount: 1120,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 12 },
      { size: 7, stock: 20 },
      { size: 8, stock: 25 },
      { size: 9, stock: 19 },
      { size: 10, stock: 15 },
      { size: 11, stock: 8 }
    ],
    colors: ['Parchment Off-White', 'Black Classic', 'Midnight Navy'],
    description: 'By 1970, the Chuck evolved to become the pinnacle of function and utility for sport. The Chuck 70 is built off of that original 1970s design, with extraordinary attention to detail.',
    highlights: [
      'Heavyweight 12oz organic canvas for durability and elevated feel',
      'Glossy egret foxing tape and vintage license plate branding',
      'OrthoLite cushioned insole for all-day campus walking comfort',
      'Archival star ankle patch and winged tongue stitching',
      'Thicker vulcanized rubber toe bumper'
    ],
    specifications: {
      soleMaterial: '100% Vulcanized Gum Rubber',
      upperMaterial: 'Heavyweight 12oz Organic Canvas',
      fastening: '10-Eyelet Lace-Up',
      weight: '380g',
      cushioning: 'OrthoLite Insole',
      origin: 'India',
      warranty: '3 Months Brand Warranty',
      care: 'Spot clean with mild soap and warm water.'
    },
    createdAt: '2026-01-05T09:00:00.000Z'
  },
  {
    id: 'prod-woodland-leather-boots',
    name: 'Genuine Nubuck Leather All-Terrain Explorer Boots',
    brand: 'Woodland',
    category: 'Boots',
    gender: 'Men',
    price: 4599,
    originalPrice: 7999,
    discountPercent: 42,
    rating: 4.5,
    ratingCount: 3890,
    reviewCount: 890,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 6 },
      { size: 7, stock: 9 },
      { size: 8, stock: 14 },
      { size: 9, stock: 8 },
      { size: 10, stock: 5 },
      { size: 11, stock: 3 }
    ],
    colors: ['Camel Khaki', 'Forest Olive', 'Dark Chocolate'],
    description: 'Built for rugged landscapes and college campus treks. Handcrafted from heavy-duty genuine oiled nubuck leather with deep lugged rubber outsoles that bite through mud, rocks, and slick tiles.',
    highlights: [
      'Water-resistant treated nubuck oil-pullup leather',
      'Deep tread lugged rubber sole for extreme traction and mountain treks',
      'Rust-proof brass hexagonal eyelets with reinforced speed lacing',
      'Padded leather collar preventing ankle chafing',
      'Triple-stitched stress points for lifelong durability'
    ],
    specifications: {
      soleMaterial: 'Heavy-Duty Thermoplastic Rubber (TPR)',
      upperMaterial: 'Genuine Oiled Nubuck Leather',
      fastening: 'Speed Lace-Up with Brass Eyelets',
      weight: '590g',
      cushioning: 'High-Density EVA Footbed',
      origin: 'India',
      warranty: '1 Year Brand Guarantee against sole separation',
      care: 'Condition with leather wax or dubbin. Keep away from direct heat.'
    },
    createdAt: '2026-01-18T11:20:00.000Z'
  },
  {
    id: 'prod-louis-formal-oxford',
    name: 'Handcrafted Italian Cap-Toe Derby Formal Shoes',
    brand: 'Clarks',
    category: 'Formal',
    gender: 'Men',
    price: 3699,
    originalPrice: 6499,
    discountPercent: 43,
    rating: 4.6,
    ratingCount: 1240,
    reviewCount: 290,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 4 },
      { size: 7, stock: 7 },
      { size: 8, stock: 12 },
      { size: 9, stock: 10 },
      { size: 10, stock: 5 },
      { size: 11, stock: 2 }
    ],
    colors: ['Burnished Mahogany Brown', 'Jet Onyx Black', 'Cognac Tan'],
    description: 'Impeccable style for placements, college convocations, internships, and corporate boardroom presentations. Featuring Argentine leather finish and memory foam insoles.',
    highlights: [
      'High-shine hand-burnished toe cap finish',
      'Orthopedic memory foam insole reduces heel strain during long standing',
      'Anti-skid ribbed resin sole with rubber heel insert',
      'Breathable sheepskin leather inner lining preventing foot odor',
      'Classic 5-eyelet closed lacing silhouette'
    ],
    specifications: {
      soleMaterial: 'Anti-Skid Resin Rubber Hybrid',
      upperMaterial: '100% Genuine Full-Grain Calfskin Leather',
      fastening: 'Waxed Cotton Lace-Up',
      weight: '410g',
      cushioning: 'Memory Foam Dual Cushioning',
      origin: 'India',
      warranty: '6 Months Brand Warranty',
      care: 'Polish with neutral cream polish and buff with horsehair brush.'
    },
    createdAt: '2026-01-25T15:00:00.000Z'
  },
  {
    id: 'prod-vans-old-skool',
    name: 'Old Skool Pro Skateboarding Shoes',
    brand: 'Vans',
    category: 'Casual',
    gender: 'Unisex',
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
    rating: 4.7,
    ratingCount: 4620,
    reviewCount: 950,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 15 },
      { size: 7, stock: 22 },
      { size: 8, stock: 30 },
      { size: 9, stock: 20 },
      { size: 10, stock: 11 },
      { size: 11, stock: 5 }
    ],
    colors: ['Black / White Sidestripe', 'Checkered Checkerboard', 'Navy Suede'],
    description: 'First known as the Vans #36, the Old Skool debuted in 1977 with a unique new addition: a random doodle drawn by founder Paul Van Doren, and originally referred to as the "jazz stripe."',
    highlights: [
      'Signature side stripe branding that made skate history',
      'DURACAP reinforcement rubber underlays in high-wear zones',
      'POPCUSH energy return footbeds for superior cushioning & boardfeel',
      'SICKSTICK proprietary rubber compound for maximum sticky grip',
      'Durable suede and 10 oz canvas uppers'
    ],
    specifications: {
      soleMaterial: 'Signature Waffle Gum Sole',
      upperMaterial: 'Suede and Heavy Canvas',
      fastening: 'Lace-Up',
      weight: '390g',
      cushioning: 'PopCush Impact Foam',
      origin: 'China',
      warranty: '3 Months Brand Warranty',
      care: 'Wipe with soft cloth. Avoid soaking suede areas in water.'
    },
    createdAt: '2026-02-05T10:00:00.000Z'
  },
  {
    id: 'prod-nike-air-max-270',
    name: 'Air Max 270 React "Bauhaus" Edition',
    brand: 'Nike',
    category: 'Sneakers',
    gender: 'Men',
    price: 8999,
    originalPrice: 14995,
    discountPercent: 40,
    rating: 4.8,
    ratingCount: 3950,
    reviewCount: 820,
    isAssured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 3 },
      { size: 7, stock: 8 },
      { size: 8, stock: 10 },
      { size: 9, stock: 12 },
      { size: 10, stock: 7 },
      { size: 11, stock: 3 }
    ],
    colors: ['Phantom / University Gold', 'Triple Black', 'Pure Platinum'],
    description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude with an extra-large 270-degree Max Air unit in the heel that gives you resilient bounce wherever your day takes you.",
    highlights: [
      'Giant 270-degree visible Air Max window in heel',
      'Nike React foam technology in forefoot gives an extremely smooth ride',
      'Stretchy inner sleeve creates a snug, bootie-like sock fit',
      'Mesh details for an airy, ventilated foot feel',
      'Rubber toe tip for extended durability'
    ],
    specifications: {
      soleMaterial: 'Translucent Air Max Heel & Rubber Forefoot',
      upperMaterial: 'Knit & Synthetic No-Sew Skins',
      fastening: 'Asymmetrical Speed Lacing',
      weight: '345g',
      cushioning: 'Max Air 270 + Nike React Foam',
      origin: 'Vietnam',
      warranty: '6 Months Brand Warranty',
      care: 'Clean with damp cloth and mild sneaker cleaner.'
    },
    createdAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'prod-asics-gel-kayano-30',
    name: 'GEL-KAYANO 30 Stability Running Shoes',
    brand: 'Asics',
    category: 'Sports',
    gender: 'Unisex',
    price: 10499,
    originalPrice: 16999,
    discountPercent: 38,
    rating: 4.9,
    ratingCount: 2180,
    reviewCount: 490,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 4 },
      { size: 7, stock: 9 },
      { size: 8, stock: 14 },
      { size: 9, stock: 11 },
      { size: 10, stock: 6 },
      { size: 11, stock: 2 }
    ],
    colors: ['Illuminate Yellow / Black', 'Sheet Rock / Glow Blue', 'White / Sun Peach'],
    description: 'From 5Ks to full marathons, the GEL-KAYANO® 30 shoe is designed to provide advanced stability and softer cushioning properties. The revolutionary 4D GUIDANCE SYSTEM™ adapts to pronation changes as fatigue sets in.',
    highlights: [
      '4D GUIDANCE SYSTEM™ feature helps create adaptive stability',
      'Rearfoot PureGEL™ technology improves impact absorption by 65%',
      'FF BLAST™ PLUS ECO cushioning made with 24% bio-based content',
      'Engineered stretch knit upper improves breathability',
      'AHARPLUS™ heel plug rubber enhances sole longevity'
    ],
    specifications: {
      soleMaterial: 'AHARPLUS™ High-Abrasion Rubber',
      upperMaterial: '4-Way Stretch Knit Upper',
      fastening: 'Standard Lace-Up',
      weight: '303g',
      cushioning: 'PureGEL™ & FF BLAST™ PLUS ECO',
      origin: 'Indonesia',
      warranty: '6 Months Brand Warranty',
      care: 'Air dry away from direct sunlight. Do not tumble dry.'
    },
    createdAt: '2026-02-18T16:00:00.000Z'
  },
  {
    id: 'prod-birkenstock-arizona-sandal',
    name: 'Arizona Eva Waterproof Slip-on Sandals',
    brand: 'Birkenstock',
    category: 'Casual',
    gender: 'Unisex',
    price: 2499,
    originalPrice: 4490,
    discountPercent: 44,
    rating: 4.6,
    ratingCount: 3410,
    reviewCount: 680,
    isAssured: true,
    images: [
      'https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 10 },
      { size: 7, stock: 15 },
      { size: 8, stock: 20 },
      { size: 9, stock: 18 },
      { size: 10, stock: 12 },
      { size: 11, stock: 6 }
    ],
    colors: ['Anthracite Grey', 'Navy Blue', 'Khaki Olive'],
    description: 'The legendary two-strap design from BIRKENSTOCK. Modeled on the cork original, this sandal is made from ultra-lightweight and highly flexible EVA that is waterproof and washable.',
    highlights: [
      'Anatomically shaped BIRKENSTOCK footbed in EVA',
      'Waterproof, ultra-lightweight and easy to wash',
      'Two individually adjustable straps with pin buckles',
      'Ideal for hostel dorms, poolside, beach, or casual college wear',
      'Shock-absorbing EVA sole'
    ],
    specifications: {
      soleMaterial: 'One-piece molded EVA',
      upperMaterial: 'Odorless Waterproof EVA',
      fastening: 'Twin Adjustable Pin Buckles',
      weight: '175g',
      cushioning: 'Anatomical Orthopedic Arch Support',
      origin: 'Germany',
      warranty: '3 Months Brand Warranty',
      care: 'Wash with clean freshwater and mild soap.'
    },
    createdAt: '2026-02-20T11:00:00.000Z'
  },
  {
    id: 'prod-puma-suede-classic',
    name: 'Suede Classic XXI B-Boy Heritage',
    brand: 'Puma',
    category: 'Sneakers',
    gender: 'Unisex',
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    rating: 4.7,
    ratingCount: 2900,
    reviewCount: 510,
    isAssured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85'
    ],
    sizes: [
      { size: 6, stock: 5 },
      { size: 7, stock: 8 },
      { size: 8, stock: 14 },
      { size: 9, stock: 9 },
      { size: 10, stock: 4 },
      { size: 11, stock: 2 }
    ],
    colors: ['Peacoat Navy / White', 'High Risk Red', 'Forest Green'],
    description: 'The Suede hit the scene in 1968 and has been changing the game ever since. From Tommie Smith’s podium protest to 1980s b-boy breakdance crews in NYC, it remains an eternal style monument.',
    highlights: [
      'Full suede upper with synthetic lining',
      'Comfortable sockliner for instant step-in cushioning',
      'Rubber midsole and non-marking rubber outsole',
      'PUMA Formstrip at medial and lateral sides',
      'Gold metallic foil PUMA Suede callout'
    ],
    specifications: {
      soleMaterial: 'Textured Cupsole Rubber',
      upperMaterial: 'Velvety Premium Cow Suede',
      fastening: 'Wide Flat Cotton Laces',
      weight: '360g',
      cushioning: 'SoftFoam+ Cushioned Sockliner',
      origin: 'Vietnam',
      warranty: '3 Months Brand Warranty',
      care: 'Clean with dedicated suede eraser and soft nylon brush.'
    },
    createdAt: '2026-02-22T13:10:00.000Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-nike-air-jordan-1',
    userName: 'Aakash Verma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Mindblowing quality! 100% original Flipkart Assured',
    comment: 'The leather grain on this Lost & Found pair is phenomenal. Got it verified at Sneakerfest, completely legit. Delivery was super fast via Ekart within 48 hours. Cushioning is surprisingly comfortable for an 80s silhouette.',
    date: '14 Feb 2026',
    verifiedBuyer: true,
    helpfulCount: 84,
    fit: 'True to Size',
    comfortRating: 5,
    durabilityRating: 5
  },
  {
    id: 'rev-2',
    productId: 'prod-nike-air-jordan-1',
    userName: 'Priya Sundaram',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Head turner on college campus!',
    comment: 'Wore these for our college tech fest inauguration and everyone asked where I grabbed them. Comes with both black and white laces. The cracked collar aesthetic gives it an unbelievable retro vibe.',
    date: '28 Jan 2026',
    verifiedBuyer: true,
    helpfulCount: 52,
    fit: 'True to Size',
    comfortRating: 4,
    durabilityRating: 5
  },
  {
    id: 'rev-3',
    productId: 'prod-nike-air-jordan-1',
    userName: 'Rohan Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    title: 'Great sneakers, slight break-in period',
    comment: 'Looks fantastic with cargo pants and oversized tees. Leather is thick so give it 2-3 days of wear to break in. Definitely go true to your UK size.',
    date: '10 Jan 2026',
    verifiedBuyer: true,
    helpfulCount: 31,
    fit: 'True to Size',
    comfortRating: 4,
    durabilityRating: 5
  },
  {
    id: 'rev-4',
    productId: 'prod-adidas-ultraboost-light',
    userName: 'Vikram Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Like running on responsive clouds!',
    comment: 'Clocked over 120km on morning runs already. The 30% lighter boost formulation is definitely noticeable compared to older UB models. Continental grip has zero slips even on wet morning tracks.',
    date: '02 Mar 2026',
    verifiedBuyer: true,
    helpfulCount: 67,
    fit: 'True to Size',
    comfortRating: 5,
    durabilityRating: 5
  },
  {
    id: 'rev-5',
    productId: 'prod-converse-chuck-70',
    userName: 'Tanvi Agarwal',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Infinitely better than standard All-Stars',
    comment: 'The Chuck 70 has much thicker 12oz canvas and an actual OrthoLite cushioned insole so your feet do not hurt after walking between lectures all day. Must buy for every college student!',
    date: '20 Feb 2026',
    verifiedBuyer: true,
    helpfulCount: 95,
    fit: 'True to Size',
    comfortRating: 5,
    durabilityRating: 5
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'OD-7829104829',
    trackingNumber: 'EKART-948201948',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        size: 9,
        color: 'Varsity Red / Black / Sail',
        quantity: 1,
        price: 13999
      }
    ],
    shippingAddress: {
      fullName: 'Aakash Verma',
      phone: '9876543210',
      pincode: '560034',
      locality: 'Koramangala 4th Block',
      addressLine: '#42, 3rd Cross, Near BDA Complex',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Opposite Starbucks',
      type: 'Home'
    },
    paymentDetails: {
      method: 'UPI',
      status: 'PAID',
      transactionId: 'UPI-98421049281@okaxis',
      upiId: 'aakash.v@okaxis'
    },
    pricing: {
      totalMRP: 18999,
      discountOnMRP: 5000,
      couponDiscount: 500,
      deliveryFee: 0,
      totalAmount: 13499,
      superCoinsEarned: 135
    },
    couponApplied: 'BIGSALE',
    status: 'OUT_FOR_DELIVERY',
    trackingTimeline: [
      {
        status: 'CONFIRMED',
        title: 'Order Confirmed',
        description: 'Seller has processed your order. Item packed in tamper-proof bubble sleeve.',
        date: '03 Oct 2026',
        time: '11:42 AM',
        completed: true,
        current: false,
        location: 'Flipkart Fulfillment Centre, Hosur'
      },
      {
        status: 'SHIPPED',
        title: 'Shipped with Ekart Express',
        description: 'Package received at Bengaluru Hub. Manifested for dispatch.',
        date: '04 Oct 2026',
        time: '04:15 PM',
        completed: true,
        current: false,
        location: 'Ekart Logistics Hub, Bommanahalli'
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Delivery Executive Ramesh Kumar (Mob: 98452-XXXXX) is arriving with your shipment.',
        date: '05 Oct 2026',
        time: '08:15 AM',
        completed: true,
        current: true,
        location: 'Koramangala Delivery Station'
      },
      {
        status: 'DELIVERED',
        title: 'Delivered',
        description: 'Item will be delivered with OTP verification at your doorstep.',
        date: '05 Oct 2026',
        time: 'Expected by 06:00 PM',
        completed: false,
        current: false
      }
    ],
    courierPartner: 'Ekart Logistics Express',
    estimatedDeliveryDate: '05 Oct 2026 (Today by 6:00 PM)',
    createdAt: '2026-10-03T06:12:00.000Z'
  },
  {
    id: 'OD-5938201948',
    trackingNumber: 'EKART-829104829',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        size: 8,
        color: 'Core Black / Solar Red',
        quantity: 1,
        price: 9499
      },
      {
        product: INITIAL_PRODUCTS[4],
        size: 8,
        color: 'Parchment Off-White',
        quantity: 1,
        price: 3999
      }
    ],
    shippingAddress: {
      fullName: 'Vikram Mehta',
      phone: '9988776655',
      pincode: '400050',
      locality: 'Bandra West',
      addressLine: 'Flat 402, Sea Green Apartments, Hill Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'Home'
    },
    paymentDetails: {
      method: 'CARD',
      status: 'PAID',
      transactionId: 'TXN_CARD_7891230491',
      cardLast4: '4242',
      bankName: 'HDFC Bank Visa Platinum'
    },
    pricing: {
      totalMRP: 23998,
      discountOnMRP: 10500,
      couponDiscount: 1500,
      deliveryFee: 0,
      totalAmount: 11998,
      superCoinsEarned: 120
    },
    couponApplied: 'COLLEGE2026',
    status: 'DELIVERED',
    trackingTimeline: [
      {
        status: 'CONFIRMED',
        title: 'Order Confirmed',
        description: 'Order approved and packed.',
        date: '28 Sep 2026',
        time: '02:30 PM',
        completed: true,
        current: false,
        location: 'Mumbai Bhiwandi Hub'
      },
      {
        status: 'SHIPPED',
        title: 'Shipped',
        description: 'In transit to Bandra distribution facility.',
        date: '29 Sep 2026',
        time: '09:00 AM',
        completed: true,
        current: false,
        location: 'Kurla Logistics Center'
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Courier agent Deepak on delivery route.',
        date: '30 Sep 2026',
        time: '10:15 AM',
        completed: true,
        current: false,
        location: 'Bandra Hub'
      },
      {
        status: 'DELIVERED',
        title: 'Delivered Successfully',
        description: 'Delivered to customer. Signature and delivery OTP verified.',
        date: '30 Sep 2026',
        time: '01:45 PM',
        completed: true,
        current: true,
        location: 'Bandra West'
      }
    ],
    courierPartner: 'Ekart Logistics Express',
    estimatedDeliveryDate: '30 Sep 2026',
    createdAt: '2026-09-28T09:00:00.000Z'
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'COLLEGE2026',
    description: '15% Instant Discount for Students on orders above ₹2,499 (Max ₹1,500)',
    discountPercent: 15,
    minOrder: 2499
  },
  {
    code: 'BIGSALE',
    description: 'Flat ₹500 off on your festival shoe haul above ₹4,999',
    flatDiscount: 500,
    minOrder: 4999
  },
  {
    code: 'FIRSTKICK',
    description: '20% off for first-time SoleKart shoppers (Max ₹1,000)',
    discountPercent: 20,
    minOrder: 1999
  },
  {
    code: 'KICKASSURE',
    description: 'Extra ₹300 off on all Flipkart KickAssure verified sneaker drops',
    flatDiscount: 300,
    minOrder: 2999
  }
];
