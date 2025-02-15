import xml.etree.ElementTree as ET
import re
import logging

# Configure logging
logging.basicConfig(filename='unprocessed_sms.log', level=logging.INFO)

def parse_xml(file):
    tree = ET.parse(file)
    root = tree.getroot()
    
    transactions = []
    for sms in root.findall('sms'):
        body = sms.find('body').text
        transaction = clean_and_categorize_data(body)
        if transaction:
            transactions.append(transaction)
        else:
            logging.info(f'Unprocessed: {body}')
    return transactions

def clean_and_categorize_data(body):
    transaction = {}
    
    # Regex for common fields in the SMS
    if "received" in body:
        transaction["type"] = "Incoming Money"
    elif "payment" in body and "completed" in body:
        transaction["type"] = "Payments to Code Holders"
    elif "withdrawn" in body:
        transaction["type"] = "Withdrawals from Agents"
    elif "transferred to" in body:
        transaction["type"] = "Transfers to Mobile Numbers"
    elif "bank deposit" in body:
        transaction["type"] = "Bank Deposits"
    elif "bundles" in body or "airtime" in body:
        transaction["type"] = "Airtime or Bundle Purchases"
    elif "transaction" in body:
        transaction["type"] = "Transactions Initiated by Third Parties"
    elif "cash power" in body:
        transaction["type"] = "Cash Power Bill Payments"
    else:
        return None
    
    # Common regex patterns for amount, date, and transaction ID
    amount_match = re.search(r'(\d+[,.]?\d*) RWF', body)
    date_match = re.search(r'Date[:]? (\S+ \S+)', body) or re.search(r'on (\S+ \S+)', body)
    txid_match = re.search(r'TxId[:]? (\d+)', body)
    
    if amount_match:
        transaction["amount"] = int(amount_match.group(1).replace(',', ''))
    if date_match:
        transaction["date"] = date_match.group(1)
    if txid_match:
        transaction["transaction_id"] = txid_match.group(1)
    
    return transaction

# Example usage
file = 'sms_data.xml'
transactions = parse_xml(file)
print(transactions)