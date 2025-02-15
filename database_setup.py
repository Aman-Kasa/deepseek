import sqlite3

def create_database():
    try:
        conn = sqlite3.connect('sms_transactions.db')
        cursor = conn.cursor()
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS transactions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            transaction_type TEXT,
                            amount INTEGER,
                            date TEXT)''')
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred while creating the database: {e}")
    finally:
        if conn:
            conn.close()

def insert_transaction(transaction):
    try:
        conn = sqlite3.connect('sms_transactions.db')
        cursor = conn.cursor()
        
        cursor.execute('''INSERT INTO transactions (transaction_type, amount, date) 
                          VALUES (?, ?, ?)''', (transaction['type'], transaction['amount'], transaction['date']))
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred while inserting the transaction: {e}")
    finally:
        if conn:
            conn.close()

def insert_transactions(transactions):
    try:
        conn = sqlite3.connect('sms_transactions.db')
        cursor = conn.cursor()
        
        cursor.executemany('''INSERT INTO transactions (transaction_type, amount, date) 
                              VALUES (?, ?, ?)''', [(t['type'], t['amount'], t['date']) for t in transactions])
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred while inserting transactions: {e}")
    finally:
        if conn:
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

# Insert multiple sample transactions
sample_transactions = [
    {
        'type': 'Incoming Money',
        'amount': 5000,
        'date': '2024-01-01 10:00:00'
    },
    {
        'type': 'Payments to Code Holders',
        'amount': 3000,
        'date': '2024-01-02 12:00:00'
    }
]
insert_transactions(sample_transactions)