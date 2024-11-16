let menuItems = [];
let currentOrder = new Map();
let currentCategory = 'all';

// Add fallback menu items
const fallbackMenuItems = [
    // Cafe Menu - Beverages
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
        description: "Fresh brewed coffee"
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
    
    // Cafe Menu - Quick Bites
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
        description: "Maggi with cottage cheese"
    },
    {
        name: "Egg Maggi",
        category: "Cafe - Quick Bites",
        price: 50,
        description: "Maggi with egg"
    },
    {
        name: "Chole Slice",
        category: "Cafe - Quick Bites",
        price: 50,
        description: "Bread slice with chickpea curry"
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
    
    // Cafe Menu - Parathas
    {
        name: "Chole Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Paratha with chickpea curry"
    },
    {
        name: "Aloo Paratha",
        category: "Cafe - Parathas",
        price: 25,
        description: "Potato stuffed paratha"
    },
    {
        name: "Aloo Piyaz Paratha",
        category: "Cafe - Parathas",
        price: 30,
        description: "Potato and onion paratha"
    },
    {
        name: "Lachha Paratha",
        category: "Cafe - Parathas",
        price: 10,
        description: "Layered paratha"
    },
    {
        name: "Paneer Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Cottage cheese paratha"
    },
    {
        name: "Single Egg Paratha",
        category: "Cafe - Parathas",
        price: 30,
        description: "Paratha with one egg"
    },
    {
        name: "Double Egg Paratha",
        category: "Cafe - Parathas",
        price: 50,
        description: "Paratha with two eggs"
    },
    
    // Cafe Menu - Breakfast
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
        description: "Special meat stew"
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
        description: "Classic chicken curry"
    },
    {
        name: "Chicken Aachari",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Pickle flavored chicken"
    },
    {
        name: "Chicken Stew",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Light chicken curry"
    },
    {
        name: "Chicken Kadhai",
        category: "Restaurant - Chicken",
        price: 80,
        description: "Spicy chicken curry"
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
        description: "Lentils with mutton"
    },
    {
        name: "Palak Gosht",
        category: "Restaurant - Mutton",
        price: 80,
        description: "Spinach with mutton"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing menu items...');
    menuItems = fallbackMenuItems;
    console.log('Menu items:', menuItems);
    displayMenuItems(menuItems);
    loadExistingOrder();
});

function displayMenuItems(items) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) {
        console.error('Menu container not found');
        return;
    }

    const filteredItems = items.filter(item => {
        if (currentCategory === 'all') return true;
        return item.category.includes(currentCategory);
    });

    menuContainer.innerHTML = filteredItems.map(item => {
        const currentQty = currentOrder.get(item.name) || 0;
        
        return `
            <div class="menu-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity-display" id="qty-${item.name.replace(/\s+/g, '-')}">${currentQty}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateQuantity(itemName, change) {
    const currentQty = currentOrder.get(itemName) || 0;
    const newQty = Math.max(0, currentQty + change);
    
    if (newQty === 0) {
        currentOrder.delete(itemName);
    } else {
        currentOrder.set(itemName, newQty);
    }
    
    const qtyDisplay = document.getElementById(`qty-${itemName.replace(/\s+/g, '-')}`);
    if (qtyDisplay) qtyDisplay.textContent = newQty;
    
    updateOrderDisplay();
    saveOrderToStorage();
}

function updateOrderDisplay() {
    const selectedItemsContainer = document.getElementById('selectedItems');
    let html = '';
    let total = 0;

    currentOrder.forEach((quantity, itemName) => {
        const item = menuItems.find(i => i.name === itemName);
        if (item) {
            const itemTotal = item.price * quantity;
            total += itemTotal;
            html += `
                <div class="selected-item">
                    <div class="selected-item-details">
                        <div class="selected-item-name">${item.name} × ${quantity}</div>
                        <div class="selected-item-price">₹${item.price.toFixed(2)} each</div>
                    </div>
                    <div class="selected-item-total">₹${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }
    });

    selectedItemsContainer.innerHTML = html;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

function filterCategory(category) {
    console.log('Filtering category:', category);
    currentCategory = category;
    
    document.querySelectorAll('.category-tab').forEach(tab => {
        if (category === 'all') {
            tab.classList.toggle('active', tab.textContent.toLowerCase() === 'all items');
        } else {
            tab.classList.toggle('active', tab.textContent.toLowerCase().includes(category.toLowerCase()));
        }
    });
    
    displayMenuItems(menuItems);
}

function saveOrderToStorage() {
    const orderData = {
        items: Array.from(currentOrder.entries()),
        timestamp: new Date().toISOString()
    };
    
    const tableOrders = JSON.parse(localStorage.getItem('tableOrders') || '{}');
    tableOrders[11] = orderData;
    localStorage.setItem('tableOrders', JSON.stringify(tableOrders));
}

function loadExistingOrder() {
    const tableOrders = JSON.parse(localStorage.getItem('tableOrders') || '{}');
    if (tableOrders[11]) {
        currentOrder = new Map(tableOrders[11].items || []);
        
        menuItems.forEach(item => {
            const qty = currentOrder.get(item.name) || 0;
            const qtyDisplay = document.getElementById(`qty-${item.name.replace(/\s+/g, '-')}`);
            if (qtyDisplay) {
                qtyDisplay.textContent = qty;
            }
        });
        
        updateOrderDisplay();
    }
}

function clearBill() {
    if (currentOrder.size === 0) {
        alert('No items to clear');
        return;
    }

    if (confirm('Are you sure you want to clear all items?')) {
        currentOrder.clear();
        menuItems.forEach(item => {
            const qtyDisplay = document.getElementById(`qty-${item.name.replace(/\s+/g, '-')}`);
            if (qtyDisplay) qtyDisplay.textContent = '0';
        });
        updateOrderDisplay();
        saveOrderToStorage();
    }
}

function markAsPaid() {
    if (currentOrder.size === 0) {
        alert('No items to mark as paid');
        return;
    }

    if (confirm('Mark this order as paid?')) {
        // Calculate the total amount
        const totalAmount = calculateTotal();
        
        // Save the paid order to history
        const paidOrder = {
            items: Array.from(currentOrder.entries()),
            timestamp: new Date().toISOString(),
            total: totalAmount,
            tableNumber: 11,
            status: 'paid'
        };

        // Save to paid orders history
        const paidOrders = JSON.parse(localStorage.getItem('paidOrders') || '[]');
        paidOrders.push(paidOrder);
        localStorage.setItem('paidOrders', JSON.stringify(paidOrders));

        // Update total revenue
        const currentRevenue = parseFloat(localStorage.getItem('totalRevenue') || '0');
        const newRevenue = currentRevenue + totalAmount;
        localStorage.setItem('totalRevenue', newRevenue.toString());

        // Clear the current order
        currentOrder.clear();
        menuItems.forEach(item => {
            const qtyDisplay = document.getElementById(`qty-${item.name.replace(/\s+/g, '-')}`);
            if (qtyDisplay) qtyDisplay.textContent = '0';
        });
        
        // Update displays
        updateOrderDisplay();
        saveOrderToStorage();
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

function calculateTotal() {
    let total = 0;
    currentOrder.forEach((quantity, itemName) => {
        const item = menuItems.find(i => i.name === itemName);
        if (item) {
            total += item.price * quantity;
        }
    });
    return parseFloat(total.toFixed(2)); // Ensure we have a clean number
}
 