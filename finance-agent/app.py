from flask import Flask, render_template, request, jsonify, session
from datetime import datetime, timedelta
import json
import os
from collections import defaultdict
import re

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

# Simple in-memory storage (replace with database in production)
users_data = {}

class FinanceAgent:
    def __init__(self, user_id):
        self.user_id = user_id
        if user_id not in users_data:
            users_data[user_id] = {
                'expenses': [],
                'budget': 10000,  # Default monthly budget
                'savings_goal': 5000,  # Default savings goal
                'categories': defaultdict(float)
            }
        self.data = users_data[user_id]
    
    def categorize_expense(self, description):
        """AI-based expense categorization using keyword matching"""
        description = description.lower()
        
        categories = {
            'food': ['food', 'restaurant', 'cafe', 'lunch', 'dinner', 'breakfast', 'snack', 'zomato', 'swiggy'],
            'transport': ['uber', 'ola', 'bus', 'metro', 'train', 'fuel', 'petrol', 'taxi', 'auto'],
            'shopping': ['amazon', 'flipkart', 'clothes', 'shopping', 'mall', 'purchase'],
            'entertainment': ['movie', 'netflix', 'spotify', 'game', 'concert', 'party'],
            'utilities': ['electricity', 'water', 'internet', 'phone', 'bill', 'recharge'],
            'health': ['medicine', 'doctor', 'hospital', 'pharmacy', 'medical', 'gym'],
            'education': ['book', 'course', 'tuition', 'fee', 'study', 'college']
        }
        
        for category, keywords in categories.items():
            if any(keyword in description for keyword in keywords):
                return category
        
        return 'others'
    
    def add_expense(self, amount, description, date=None):
        """Add a new expense"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        category = self.categorize_expense(description)
        
        expense = {
            'id': len(self.data['expenses']) + 1,
            'amount': float(amount),
            'description': description,
            'category': category,
            'date': date
        }
        
        self.data['expenses'].append(expense)
        self.data['categories'][category] += float(amount)
        
        return expense
    
    def get_spending_summary(self, days=30):
        """Get spending summary for the last N days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        total_spent = 0
        category_wise = defaultdict(float)
        
        for expense in self.data['expenses']:
            expense_date = datetime.strptime(expense['date'], '%Y-%m-%d')
            if expense_date >= cutoff_date:
                total_spent += expense['amount']
                category_wise[expense['category']] += expense['amount']
        
        return {
            'total_spent': total_spent,
            'by_category': dict(category_wise),
            'budget': self.data['budget'],
            'remaining': self.data['budget'] - total_spent
        }
    
    def get_ai_insights(self):
        """Generate AI-powered insights and recommendations"""
        summary = self.get_spending_summary()
        insights = []
        
        # Budget analysis
        spent_percentage = (summary['total_spent'] / summary['budget']) * 100
        
        if spent_percentage > 90:
            insights.append({
                'type': 'warning',
                'message': f"⚠️ Alert! You've spent {spent_percentage:.1f}% of your monthly budget. Time to cut down on expenses!"
            })
        elif spent_percentage > 75:
            insights.append({
                'type': 'caution',
                'message': f"⚡ Caution! You've used {spent_percentage:.1f}% of your budget. Watch your spending!"
            })
        else:
            insights.append({
                'type': 'success',
                'message': f"✅ Good job! You've spent {spent_percentage:.1f}% of your budget. Keep it up!"
            })
        
        # Category-wise analysis
        if summary['by_category']:
            top_category = max(summary['by_category'], key=summary['by_category'].get)
            top_amount = summary['by_category'][top_category]
            
            insights.append({
                'type': 'info',
                'message': f"💰 Your highest spending is on '{top_category}' (₹{top_amount:.2f}). Consider reducing it!"
            })
        
        # Savings suggestion
        potential_savings = summary['remaining']
        if potential_savings > 0:
            insights.append({
                'type': 'tip',
                'message': f"💡 Tip: You can save ₹{potential_savings:.2f} this month if you avoid new expenses!"
            })
        
        return insights
    
    def chatbot_response(self, user_message):
        """AI chatbot for financial queries"""
        message = user_message.lower()
        
        # Tips and Advice (priority)
        if any(word in message for word in ['tip', 'advice', 'reduce', 'decrease', 'lower', 'cut down']):
            insights = self.get_ai_insights()
            if not insights:
                return "Keep tracking your expenses regularly, and try cutting down on your highest spending category!"
            
            # Filter out generic 'success' messages to focus on actionable tips
            actual_tips = [i['message'] for i in insights if i['type'] != 'success']
            
            if actual_tips:
                response = "Here are some tips based on your spending:\n"
                for tip in actual_tips:
                    response += f"• {tip}\n"
                return response.strip()
                
            return "Your budget is looking healthy! Keep tracking your expenses regularly, or ask me for a category breakdown if you want to optimize further."
            
        # Savings queries
        elif 'save' in message or 'saving' in message or 'savings' in message:
            summary = self.get_spending_summary()
            return f"Based on your spending, you can potentially save ₹{summary['remaining']:.2f} this month!"

        # Expense queries
        elif any(word in message for word in ['spent', 'expenses', 'spending']):
            summary = self.get_spending_summary()
            return f"You've spent ₹{summary['total_spent']:.2f} out of ₹{summary['budget']:.2f} this month. Remaining budget: ₹{summary['remaining']:.2f}"
        
        # Budget queries
        elif 'budget' in message:
            return f"Your current monthly budget is ₹{self.data['budget']:.2f}. You can update it in settings."
        
        # Category queries
        elif 'category' in message or 'where' in message:
            summary = self.get_spending_summary()
            if summary['by_category']:
                response = "Your spending by category:\n"
                for cat, amount in sorted(summary['by_category'].items(), key=lambda x: x[1], reverse=True):
                    response += f"• {cat.title()}: ₹{amount:.2f}\n"
                return response
            return "No expenses recorded yet."
        
        else:
            return "I can help you with:\n• Your spending summary\n• Budget information\n• Savings suggestions\n• Category-wise breakdown\n• Financial tips\n\nTry asking: 'How much have I spent?' or 'Give me a tip'"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.json
    user_id = session.get('user_id', 'default_user')
    
    agent = FinanceAgent(user_id)
    expense = agent.add_expense(
        amount=data['amount'],
        description=data['description'],
        date=data.get('date')
    )
    
    return jsonify({'success': True, 'expense': expense})

@app.route('/get_summary')
def get_summary():
    user_id = session.get('user_id', 'default_user')
    agent = FinanceAgent(user_id)
    
    summary = agent.get_spending_summary()
    insights = agent.get_ai_insights()
    
    return jsonify({
        'summary': summary,
        'insights': insights,
        'expenses': agent.data['expenses'][-10:]  # Last 10 expenses
    })

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = session.get('user_id', 'default_user')
    
    agent = FinanceAgent(user_id)
    response = agent.chatbot_response(data['message'])
    
    return jsonify({'response': response})

@app.route('/update_budget', methods=['POST'])
def update_budget():
    data = request.json
    user_id = session.get('user_id', 'default_user')
    
    if user_id not in users_data:
        users_data[user_id] = {'expenses': [], 'budget': 0, 'savings_goal': 0, 'categories': defaultdict(float)}
    
    users_data[user_id]['budget'] = float(data['budget'])
    
    return jsonify({'success': True})

if __name__ == '__main__':
    # Create templates directory
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    app.run(debug=True, port=5001)
