const Item = require('./models/Item');

const foodItems = [
  // Veg (5)
  { name: 'Paneer Butter Masala', category: 'Veg', price: 120, description: 'Creamy paneer in rich tomato gravy', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  { name: 'Veg Biryani', category: 'Veg', price: 100, description: 'Fragrant basmati rice with mixed vegetables', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
  { name: 'Masala Dosa', category: 'Veg', price: 60, description: 'Crispy dosa with spiced potato filling', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
  { name: 'Dal Tadka', category: 'Veg', price: 80, description: 'Yellow lentils tempered with spices', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { name: 'Veg Fried Rice', category: 'Veg', price: 90, description: 'Stir-fried rice with fresh vegetables', imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' },

  // Non-Veg (5)
  { name: 'Chicken Biryani', category: 'Non-Veg', price: 150, description: 'Aromatic biryani with tender chicken', imageUrl: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400' },
  { name: 'Butter Chicken', category: 'Non-Veg', price: 160, description: 'Classic murgh makhani in buttery sauce', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  { name: 'Egg Fried Rice', category: 'Non-Veg', price: 100, description: 'Wok-tossed rice with scrambled eggs', imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400' },
  { name: 'Chicken 65', category: 'Non-Veg', price: 130, description: 'Spicy deep-fried chicken starter', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
  { name: 'Fish Curry', category: 'Non-Veg', price: 170, description: 'Tangy South Indian style fish curry', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },

  // Snacks (5)
  { name: 'Samosa', category: 'Snacks', price: 20, description: 'Crispy pastry with spiced potato filling', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { name: 'Vada Pav', category: 'Snacks', price: 25, description: 'Mumbai street food with spicy potato fritter', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
  { name: 'French Fries', category: 'Snacks', price: 60, description: 'Golden crispy salted fries', imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400' },
  { name: 'Pav Bhaji', category: 'Snacks', price: 70, description: 'Spiced vegetable mash with buttered bread rolls', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
  { name: 'Bread Pakora', category: 'Snacks', price: 30, description: 'Batter-fried bread with masala filling', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },

  // Drinks (5)
  { name: 'Mango Lassi', category: 'Drinks', price: 50, description: 'Chilled mango yogurt drink', imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  { name: 'Masala Chai', category: 'Drinks', price: 20, description: 'Spiced Indian tea with milk', imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400' },
  { name: 'Fresh Lime Soda', category: 'Drinks', price: 30, description: 'Refreshing sparkling lime drink', imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
  { name: 'Cold Coffee', category: 'Drinks', price: 60, description: 'Blended iced coffee with milk', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { name: 'Tender Coconut Water', category: 'Drinks', price: 40, description: 'Natural fresh coconut water', imageUrl: 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=400' }
];

async function seedItems() {
  const count = await Item.countDocuments();
  if (count === 0) {
    await Item.insertMany(foodItems);
    console.log('Food items seeded!');
  }
}

module.exports = seedItems;