document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('selectedDate').value = today;
    loadRevenueData();
});

function loadRevenueData() {
    const selectedDate = document.getElementById('selectedDate').value;
    const paidOrders = JSON.parse(localStorage.getItem('paidOrders') || '[]');
    
    // Filter orders for selected date
    const dateOrders = paidOrders.filter(order => {
        const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
        return orderDate === selectedDate;
    });

    // Calculate daily statistics
    const dailyRevenue = dateOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrder = dateOrders.length > 0 ? dailyRevenue / dateOrders.length : 0;
    const peakHour = calculatePeakHour(dateOrders);
    const totalOrders = dateOrders.length;

    // Update summary cards with animations
    animateValue('daily-revenue', dailyRevenue);
    animateValue('daily-orders', totalOrders, false);
    animateValue('average-order', averageOrder);
    document.getElementById('peak-hour').textContent = peakHour || '--:--';

    // Display orders list
    const ordersListContainer = document.getElementById('orders-list');
    if (dateOrders.length === 0) {
        ordersListContainer.innerHTML = `
            <div class="no-orders">
                No orders found for selected date
            </div>
        `;
        return;
    }

    ordersListContainer.innerHTML = dateOrders
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(order => `
            <div class="order-item">
                <div class="order-time">${formatTime(order.timestamp)}</div>
                <div class="order-table">Table ${order.tableNumber}</div>
                <div class="order-items">${getOrderItemsSummary(order.items)}</div>
                <div class="order-amount">${formatCurrency(order.total)}</div>
            </div>
        `)
        .join('');
}

function calculatePeakHour(orders) {
    if (orders.length === 0) return null;

    // Create hourly revenue tracking
    const hourlyRevenue = {};
    
    orders.forEach(order => {
        const hour = new Date(order.timestamp).getHours();
        hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + order.total;
    });

    // Find the hour with maximum revenue
    let maxRevenue = 0;
    let peakHour = 0;

    Object.entries(hourlyRevenue).forEach(([hour, revenue]) => {
        if (revenue > maxRevenue) {
            maxRevenue = revenue;
            peakHour = parseInt(hour);
        }
    });

    // Format peak hour to 12-hour format with AM/PM
    return new Date(new Date().setHours(peakHour, 0, 0)).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function getOrderItemsSummary(items) {
    if (!items || !Array.isArray(items)) return '0 items';
    const itemCount = items.reduce((sum, [_, quantity]) => sum + quantity, 0);
    const itemList = items.map(([name, qty]) => `${name} × ${qty}`).join(', ');
    return `${itemCount} items (${itemList})`;
}

// Animate value changes
function animateValue(elementId, value, isCurrency = true) {
    const element = document.getElementById(elementId);
    const start = parseFloat(element.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const duration = 1000; // Animation duration in milliseconds
    const steps = 20; // Number of steps in animation
    const increment = (value - start) / steps;
    let current = start;
    let step = 0;

    const animation = setInterval(() => {
        step++;
        current += increment;
        if (step === steps) {
            current = value;
            clearInterval(animation);
        }
        element.textContent = isCurrency ? formatCurrency(current) : Math.round(current);
    }, duration / steps);
}

// Add event listener for date changes
document.getElementById('selectedDate').addEventListener('change', loadRevenueData); 