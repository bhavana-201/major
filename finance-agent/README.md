# 🤖 AI Personal Finance & Savings Agent

## Project Overview

An AI-powered Personal Finance & Savings Agent that helps users manage their finances through intelligent expense tracking, automated categorization, personalized insights, and conversational assistance.

**Developed by:**
- Cherupally Shashank (22VE1A05L0)
- Ganji Keerthana (22VE1A05M0)
- Pendyala Bhavana (22VE1A05P6)
- T Mythri (22VE1A05R5)

**Guide:** Dr. U.M. Fernandes Dimlo  
**Institution:** Sreyas Institute of Engineering and Technology  
**Department:** Computer Science and Engineering

---

## 🎯 Features

### Core Functionality
1. **Smart Expense Tracking**
   - Add expenses with amount, description, and date
   - Automatic AI-based categorization (Food, Transport, Shopping, etc.)
   - Real-time expense listing with category badges

2. **AI-Powered Insights**
   - Budget utilization alerts (90%+: Warning, 75%+: Caution)
   - Category-wise spending analysis
   - Personalized saving suggestions
   - Spending pattern recognition

3. **Financial Dashboard**
   - Monthly budget tracking
   - Total spending summary
   - Remaining budget calculation
   - Visual category breakdown with progress bars

4. **AI Chatbot Assistant**
   - Natural language queries about finances
   - Spending summaries on demand
   - Budget information
   - Category-wise breakdown
   - Financial tips and advice

5. **Automatic Categorization**
   - Uses keyword-based ML algorithm
   - 8 predefined categories: Food, Transport, Shopping, Entertainment, Utilities, Health, Education, Others
   - Expandable category system

---

## 🏗️ Technical Architecture

### Technology Stack

**Backend:**
- Python 3.x
- Flask (Web Framework)
- In-memory data storage (upgradable to MySQL/MongoDB)

**Frontend:**
- HTML5
- CSS3 (Gradient UI Design)
- Vanilla JavaScript (Async/Await)
- Responsive Design

**AI/ML Components:**
- Keyword-based expense categorization
- Pattern recognition for spending analysis
- Predictive alerts system
- Natural Language Processing for chatbot

### Project Structure
```
finance-agent/
│
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Frontend UI
├── static/               # Static assets (if any)
├── requirements.txt      # Python dependencies
└── README.md            # Documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step 1: Install Dependencies
```bash
pip install flask
```

### Step 2: Run the Application
```bash
cd finance-agent
python app.py
```

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 💡 Usage Guide

### Adding Expenses
1. Enter the amount in rupees
2. Provide a description (e.g., "Lunch at restaurant", "Uber ride")
3. Select the date
4. Click "Add Expense"
5. The system automatically categorizes based on keywords

### Setting Budget
1. Enter desired monthly budget in the budget field
2. Click "Update Budget"
3. Dashboard updates automatically

### Using AI Chatbot
Ask questions like:
- "How much have I spent?"
- "What's my budget?"
- "Give me a tip"
- "Show me spending by category"
- "How much can I save?"

### Understanding Insights
- **🟢 Green (Success)**: Spending below 75% of budget
- **🟡 Yellow (Caution)**: Spending between 75-90% of budget
- **🔴 Red (Warning)**: Spending above 90% of budget

---

## 🧠 AI Features Explained

### 1. Automatic Categorization
The system uses keyword matching to categorize expenses:

**Example:**
- "Zomato food order" → Food
- "Uber to office" → Transport
- "Amazon shopping" → Shopping
- "Netflix subscription" → Entertainment

### 2. Spending Pattern Analysis
- Identifies top spending categories
- Calculates percentage-wise distribution
- Provides comparative insights

### 3. Predictive Alerts
- Monitors budget utilization in real-time
- Sends warnings at critical thresholds
- Suggests corrective actions

### 4. Conversational AI
- Understands natural language queries
- Provides contextual responses
- Offers personalized financial advice

---

## 🔄 Future Enhancements

### Planned Features
1. **Database Integration**
   - MySQL/MongoDB for persistent storage
   - Multi-user support with authentication

2. **Advanced ML Models**
   - Receipt OCR scanning
   - SMS parsing for automatic expense entry
   - Predictive spending forecasting

3. **Enhanced Features**
   - Goal-based savings tracker
   - Bill reminders
   - Expense sharing (family/friends)
   - Multi-currency support
   - Export to PDF/Excel

4. **Mobile App**
   - React Native/Flutter mobile application
   - Push notifications
   - Photo receipt capture

5. **API Integrations**
   - Bank account integration
   - UPI transaction import
   - Email receipt parsing

6. **Gamification**
   - Savings challenges
   - Achievement badges
   - Leaderboards

7. **Multi-language Support**
   - Hindi, Telugu, and other regional languages
   - Voice input/output

---

## 🎓 Learning Outcomes

### Technical Skills
- Web development with Flask
- Frontend design with HTML/CSS/JS
- RESTful API development
- Data structures and algorithms
- Machine Learning basics

### AI/ML Concepts
- Natural Language Processing
- Pattern recognition
- Classification algorithms
- Predictive analytics

### Software Engineering
- MVC architecture
- Code organization
- Version control
- Documentation

---

## 📊 Sample Data for Testing

Try these expenses to see categorization in action:
- "Lunch at McDonald's" - ₹250
- "Uber to college" - ₹150
- "Amazon clothes shopping" - ₹1200
- "Netflix subscription" - ₹199
- "Electricity bill" - ₹800
- "Doctor consultation" - ₹500
- "Python course on Udemy" - ₹799

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Port 5000 already in use**
```bash
# Kill the process or use a different port
python app.py  # Will show error with PID
kill -9 <PID>
```

**Issue: Templates not found**
```bash
# Ensure directory structure is correct
finance-agent/
  ├── app.py
  └── templates/
      └── index.html
```

---

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application page |
| `/add_expense` | POST | Add new expense |
| `/get_summary` | GET | Get spending summary |
| `/chat` | POST | Chatbot interaction |
| `/update_budget` | POST | Update monthly budget |

---

## 👥 Team Contribution

- **Shashank**: Backend development, AI logic
- **Keerthana**: Frontend design, UI/UX
- **Bhavana**: Testing, documentation
- **Mythri**: Feature implementation, integration

---

## 📄 License

This project is developed for educational purposes as part of the B.Tech curriculum at Sreyas Institute of Engineering and Technology.

---

## 🙏 Acknowledgments

- Dr. U.M. Fernandes Dimlo (Project Guide)
- Department of CSE, Sreyas Institute
- JNTUH, AICTE, NAAC

---

## 📧 Contact

For queries or contributions, contact the development team through the college portal.

---

**Version:** 1.0.0  
**Last Updated:** February 2026
