from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def get_data_by_type(transaction_type):
    conn = sqlite3.connect('sms_transactions.db')
    cursor = conn.cursor()
    if transaction_type == 'all':
        cursor.execute('SELECT transaction_type, SUM(amount) FROM transactions GROUP BY transaction_type')
    else:
        cursor.execute('SELECT transaction_type, SUM(amount) FROM transactions WHERE transaction_type = ? GROUP BY transaction_type', (transaction_type,))
    data = cursor.fetchall()
    conn.close()
    return data

@app.route('/get-data')
def get_data():
    transaction_type = request.args.get('type', 'all')
    data = get_data_by_type(transaction_type)
    
    labels = [row[0] for row in data]
    values = [row[1] for row in data]
    
    return jsonify({'labels': labels, 'values': values})

if __name__ == '__main__':
    app.run(debug=True)