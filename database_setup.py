import sqlite3

def create_database():
    conn = sqlite3.connect('sms_transactions.db')
    cursor = conn.cursor()
    
    cursor.execute('''CREATE TABLE IF NOT EXISTS transactions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        transaction_type TEXT,
                        amount INTEGER,
                        date TEXT)''')
    
    conn.commit()
    conn.close()

def insert_transaction(transaction):
    conn = sqlite3.connect('sms_transactions.db')
    cursor = conn.cursor()
    
    cursor.execute('''INSERT INTO transactions (transaction_type, amount, date) 
                      VALUES (?, ?, ?)''', (transaction['type'], transaction['amount'], transaction['date']))
    
    conn.commit()
    conn.close()

# Example usage: Create the database
create_database()

# Insert a sample transaction
sample_transaction = {
    'type': 'Incoming Money',
    'amount': 5000,
    'date': '2024-01-01 10:00:00'
}
insert_transaction(sample_transaction)
