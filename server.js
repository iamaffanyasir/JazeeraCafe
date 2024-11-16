const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://yasirmohammadaffan:<Affan@3398999>@cluster0.rycnp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    isAvailable: { type: Boolean, default: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Routes
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/menu', async (req, res) => {
    const menuItem = new MenuItem({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        isAvailable: req.body.isAvailable
    });

    try {
        const newMenuItem = await menuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Initial menu items
const initialMenuItems = [
    // Cafe Menu
    {
        name: "Milk Tea",
        category: "Cafe - Beverages",
        price: 12,
        description: "Classic milk tea"
    },
    {
        name: "Coffee",
        category: "Cafe - Beverages",
        price: 30,
        description: "Freshly brewed coffee"
    },
    {
        name: "Green Tea",
        category: "Cafe - Beverages",
        price: 20,
        description: "Healthy green tea"
    },
    {
        name: "Lemon Tea",
        category: "Cafe - Beverages",
        price: 20,
        description: "Refreshing lemon tea"
    },
    {
        name: "Maggi",
        category: "Cafe - Quick Bites",
        price: 30,
        description: "Classic Maggi noodles"
    },
    {
        name: "Paneer Maggi",
        category: "Cafe - Quick Bites",
        price: 50,
        description: "Maggi noodles with cottage cheese"
    },
    {
        name: "Egg Maggi",
        category: "Cafe - Quick Bites",
        price: 50,
        description: "Maggi noodles with egg"
    },
    {
        name: "Chole Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Flatbread served with chickpea curry"
    },
    {
        name: "Chole Slice",
        category: "Cafe - Quick Bites",
        price: 50,
        description: "Bread slice with chickpea curry"
    },
    {
        name: "Aloo Paratha",
        category: "Cafe - Parathas",
        price: 25,
        description: "Potato stuffed flatbread"
    },
    {
        name: "Aloo Piyaz Paratha",
        category: "Cafe - Parathas",
        price: 30,
        description: "Potato and onion stuffed flatbread"
    },
    {
        name: "Lachha Paratha",
        category: "Cafe - Parathas",
        price: 10,
        description: "Layered flatbread"
    },
    {
        name: "Paneer Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Cottage cheese stuffed flatbread"
    },
    {
        name: "Single Egg Paratha",
        category: "Cafe - Parathas",
        price: 30,
        description: "Flatbread with one egg"
    },
    {
        name: "Double Egg Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Flatbread with two eggs"
    },
    {
        name: "Single Bread Omlette",
        category: "Cafe - Breakfast",
        price: 30,
        description: "Single bread with omelette"
    },
    {
        name: "Double Bread Omlette",
        category: "Cafe - Breakfast",
        price: 50,
        description: "Double bread with omelette"
    },
    {
        name: "Bun Butter",
        category: "Cafe - Quick Bites",
        price: 30,
        description: "Buttered bun"
    },
    {
        name: "Bun Butter Jam",
        category: "Cafe - Quick Bites",
        price: 35,
        description: "Bun with butter and jam"
    },
    {
        name: "Egg Half Fry",
        category: "Cafe - Breakfast",
        price: 20,
        description: "Half fried egg"
    },

    // Restaurant Menu
    {
        name: "SPL. Nihari",
        category: "Restaurant - Special",
        price: 100,
        description: "Special slow-cooked meat stew"
    },
    {
        name: "Paaya",
        category: "Restaurant - Special",
        price: 100,
        description: "Traditional trotters curry"
    },
    {
        name: "Chicken Qorma",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Classic chicken curry in rich gravy"
    },
    {
        name: "Chicken Aachari",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Pickle-flavored chicken curry"
    },
    {
        name: "Chicken Stew",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Light chicken stew"
    },
    {
        name: "Chicken Kadhai",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Spicy chicken in thick gravy"
    },
    {
        name: "Bade Ka Stew",
        category: "Restaurant - Mutton",
        price: 80,
        description: "Traditional mutton stew"
    },
    {
        name: "Daal Gosht",
        category: "Restaurant - Mutton",
        price: 80,
        description: "Lentils cooked with mutton"
    },
    {
        name: "Palak Gosht",
        category: "Restaurant - Mutton",
        price: 80,
        description: "Spinach cooked with mutton"
    }
];

// Function to initialize menu items
async function initializeMenu() {
    try {
        // Check if menu items already exist
        const existingItems = await MenuItem.find();
        if (existingItems.length === 0) {
            await MenuItem.insertMany(initialMenuItems);
            console.log('Initial menu items added successfully');
        }
    } catch (error) {
        console.error('Error initializing menu items:', error);
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeMenu();
}); 