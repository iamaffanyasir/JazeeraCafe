// Store table statuses and orders
let tableStatuses = {};
let totalRevenue = 0;

// Initialize table statuses from localStorage or set defaults
function initializeTableStatuses() {
    try {
        const stored = localStorage.getItem('tableStatuses');
        const tableOrders = JSON.parse(localStorage.getItem('tableOrders') || '{}');
        
        if (stored) {
            tableStatuses = JSON.parse(stored);
        } else {
            // Set default status for all tables
            for (let i = 1; i <= 12; i++) {
                tableStatuses[i] = {
                    status: 'Available',
                    occupied: false,
                    timestamp: null
                };
            }
            updateLocalStorage();
        }

        // Check for active orders and update table statuses
        Object.keys(tableOrders).forEach(tableNum => {
            const order = tableOrders[tableNum];
            if (order && order.items && order.items.length > 0) {
                tableStatuses[tableNum] = {
                    status: 'Occupied',
                    occupied: true,
                    timestamp: order.timestamp
                };
            } else {
                tableStatuses[tableNum] = {
                    status: 'Available',
                    occupied: false,
                    timestamp: null
                };
            }
        });

        updateLocalStorage();
        updateTableStatuses(tableOrders);
    } catch (error) {
        console.error('Error initializing table statuses:', error);
        resetToDefaults();
    }
}

// Reset everything to defaults if there's corruption
function resetToDefaults() {
    tableStatuses = {};
    localStorage.removeItem('tableStatuses');
    localStorage.removeItem('tableOrders');
    initializeTableStatuses();
}

// Update localStorage with current table statuses
function updateLocalStorage() {
    try {
        localStorage.setItem('tableStatuses', JSON.stringify(tableStatuses));
    } catch (error) {
        console.error('Error updating localStorage:', error);
    }
}

// Calculate total bill for a table
function calculateTableTotal(items) {
    if (!Array.isArray(items)) return 0;
    let total = 0;
    items.forEach(([itemName, quantity]) => {
        const menuItem = fallbackMenuItems.find(item => item.name === itemName);
        if (menuItem) {
            total += menuItem.price * quantity;
        }
    });
    return total;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Update the visual status of all tables
function updateTableStatuses(tableOrders) {
    let activeTables = 0;
    let totalOrders = 0;
    totalRevenue = 0;

    for (let i = 1; i <= 12; i++) {
        try {
            updateSingleTableStatus(i, tableOrders, (active, orders, revenue) => {
                activeTables += active;
                totalOrders += orders;
                totalRevenue += revenue;
            });
        } catch (error) {
            console.error(`Error updating table ${i}:`, error);
        }
    }

    // Update dashboard stats
    updateDashboardStats(activeTables, 12 - activeTables, totalOrders);
}

// Update single table status
function updateSingleTableStatus(tableNum, tableOrders, callback) {
    const statusElement = document.getElementById(`status-${tableNum}`);
    const timeElement = document.getElementById(`time-${tableNum}`);
    const billElement = document.getElementById(`bill-${tableNum}`);
    const tableCard = document.querySelector(`.table-card[data-table="${tableNum}"]`);

    if (!statusElement || !timeElement || !billElement || !tableCard) {
        console.error(`Missing elements for table ${tableNum}`);
        return;
    }

    const tableData = tableOrders[tableNum];
    let isActive = 0;
    let orderCount = 0;
    let revenue = 0;

    // Check if table has any items
    if (tableData && tableData.items && tableData.items.length > 0) {
        // Table is occupied
        isActive = 1;
        orderCount = tableData.items.length;
        
        // Calculate total bill
        revenue = calculateTableTotal(tableData.items);

        // Update status to occupied
        statusElement.textContent = 'Occupied';
        statusElement.classList.add('occupied');
        tableCard.classList.add('occupied');
        
        // Show current bill
        if (revenue > 0) {
            billElement.textContent = `Current Bill: ₹${revenue.toFixed(2)}`;
            billElement.classList.add('has-bill');
        }

        // Show timestamp
        if (tableData.timestamp) {
            timeElement.textContent = new Date(tableData.timestamp).toLocaleTimeString();
        }
    } else {
        // Table is available
        statusElement.textContent = 'Available';
        statusElement.classList.remove('occupied');
        tableCard.classList.remove('occupied');
        timeElement.textContent = '';
        billElement.textContent = '';
        billElement.classList.remove('has-bill');
    }

    callback(isActive, orderCount, revenue);
}

// Reset table elements to default state
function resetTableElements(status, customer, time, bill, card) {
    status.textContent = 'Available';
    status.classList.remove('occupied');
    card.classList.remove('occupied');
    customer.textContent = '';
    time.textContent = '';
    bill.textContent = '';
    bill.classList.remove('has-bill');
}

// Update dashboard statistics
function updateDashboardStats(activeTables, availableTables, totalOrders) {
    // Get the stored total revenue
    const storedRevenue = parseFloat(localStorage.getItem('totalRevenue') || '0');
    
    const stats = {
        'active-tables': activeTables,
        'available-tables': availableTables,
        'total-orders': totalOrders,
        'total-revenue': formatCurrency(storedRevenue) // Use stored revenue instead of calculated
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Update the resetRevenue function
function resetRevenue() {
    if (confirm('Are you sure you want to reset the total revenue? This action cannot be undone.')) {
        localStorage.setItem('totalRevenue', '0');
        localStorage.setItem('paidOrders', '[]'); // Also clear paid orders history
        const revenueElement = document.getElementById('total-revenue');
        if (revenueElement) {
            revenueElement.textContent = '₹0.00';
        }
        alert('Total revenue has been reset successfully.');
    }
}

// Handle opening a table
function openTable(tableNumber) {
    if (tableNumber < 1 || tableNumber > 12) {
        console.error('Invalid table number:', tableNumber);
        return;
    }
    localStorage.setItem('currentTable', tableNumber);
    window.location.href = `table${tableNumber}.html`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTableStatuses();
    // Update every 5 seconds
    setInterval(initializeTableStatuses, 5000);
});

// Make sure we have the fallbackMenuItems array available
const fallbackMenuItems = [
    // Copy the menu items array from table1.js or table2.js
    // ... (add all menu items here)
]; 