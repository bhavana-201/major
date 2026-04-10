// Set today's date as default
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Load initial data
    loadSummary();
    setInterval(loadSummary, 30000); // Refresh every 30 seconds
});

// Add Expense
const expenseForm = document.getElementById('expenseForm');
if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const expense = {
            amount: document.getElementById('amount').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value
        };

        try {
            const response = await fetch('/add_expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });

            if (response.ok) {
                expenseForm.reset();
                document.getElementById('date').valueAsDate = new Date();
                loadSummary();
                alert('✅ Expense added successfully!');
            }
        } catch (err) {
            console.error("Error adding expense", err);
        }
    });
}

// Update Budget
async function updateBudget() {
    const budget = document.getElementById('budget').value;
    try {
        const response = await fetch('/update_budget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budget })
        });

        if (response.ok) {
            loadSummary();
            alert('✅ Budget updated!');
        }
    } catch (err) {
        console.error("Error updating budget", err);
    }
}

// Set phone for SMS-imported data
async function setPhone() {
    const phone = document.getElementById('phoneInput').value.trim();
    if (!phone) return;

    try {
        const response = await fetch('/set_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });

        if (response.ok) {
            loadSummary();
            alert(`✅ Loaded data for ${phone}`);
        }
    } catch (err) {
        console.error("Error setting phone user", err);
    }
}

const categoryColors = {
    'food': 'bg-yellow-200 text-red-700 dark:bg-yellow-900 dark:text-red-200',
    'transport': 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'shopping': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    'entertainment': 'bg-pink-200 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'utilities': 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'health': 'bg-green-200 text-green-800 dark:bg-teal-900 dark:text-teal-200',
    'education': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'others': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

const insightColors = {
    'warning': 'bg-red-50 text-red-700 border-l-4 border-red-500 dark:bg-red-900/30 dark:text-red-300',
    'caution': 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-300',
    'success': 'bg-green-50 text-green-700 border-l-4 border-green-500 dark:bg-green-900/30 dark:text-green-300',
    'info': 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300',
    'tip': 'bg-gray-50 text-gray-700 border-l-4 border-gray-500 dark:bg-gray-800 dark:text-gray-300'
};

// Load Summary
async function loadSummary() {
    try {
        const response = await fetch('/get_summary');
        const data = await response.json();

        // Update summary
        const budgetDisplay = document.getElementById('budgetDisplay');
        const spentDisplay = document.getElementById('spentDisplay');
        const remainingDisplay = document.getElementById('remainingDisplay');

        if (budgetDisplay) budgetDisplay.textContent = `₹${data.summary.budget.toLocaleString()}`;
        if (spentDisplay) spentDisplay.textContent = `₹${data.summary.total_spent.toLocaleString()}`;
        if (remainingDisplay) remainingDisplay.textContent = `₹${data.summary.remaining.toLocaleString()}`;

        // Update insights
        const insightsHtml = data.insights.map(insight =>
            `<div class="p-3 rounded shadow-sm text-sm ${insightColors[insight.type] || insightColors['info']}">${insight.message}</div>`
        ).join('');
        const insightsContainer = document.getElementById('insightsContainer');
        if (insightsContainer) {
            insightsContainer.innerHTML = insightsHtml || '<p class="text-center text-gray-400 py-4">No insights yet</p>';
        }

        // Update expenses list
        if (data.expenses && data.expenses.length > 0) {
            const expensesHtml = data.expenses.reverse().map(expense => `
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center border border-gray-100 dark:border-gray-700">
                    <div class="flex-1">
                        <div class="font-semibold text-gray-800 dark:text-gray-200">${expense.description}</div>
                        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${categoryColors[expense.category] || categoryColors['others']}">${expense.category}</span>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${expense.date}</div>
                    </div>
                    <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹${expense.amount.toFixed(2)}</div>
                </div>
            `).join('');
            const expensesList = document.getElementById('expensesList');
            if (expensesList) expensesList.innerHTML = expensesHtml;
        }

        // Update category chart
        if (Object.keys(data.summary.by_category).length > 0) {
            const chartHtml = Object.entries(data.summary.by_category)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                    const percentage = (amount / data.summary.total_spent) * 100;
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold ${categoryColors[category] || categoryColors['others']}">${category}</span>
                                <span class="font-semibold dark:text-gray-200">₹${amount.toFixed(2)}</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            const categoryChart = document.getElementById('categoryChart');
            if (categoryChart) categoryChart.innerHTML = chartHtml;
        }
    } catch (err) {
        console.error("Error loading summary", err);
    }
}

// Chat functionality
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML += `<div class="mb-4 p-3 rounded-lg max-w-[80%] bg-gradient-to-br from-indigo-500 to-purple-600 text-white ml-auto shadow-sm">${message}</div>`;
        input.value = '';

        try {
            // Get bot response
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            chatMessages.innerHTML += `<div class="mb-4 p-3 rounded-lg max-w-[80%] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600">${data.response.replace(/\n/g, '<br>')}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (err) {
            console.error("Error sending message", err);
        }
    }
}

// Allow Enter key to send message
const chatInput = document.getElementById('chatInput');
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
