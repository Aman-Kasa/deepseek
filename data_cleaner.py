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
        transaction["amount"] = int(re.search(r'(\d+) RWF', body).group(1))
        transaction["date"] = re.search(r'Date: (\S+ \S+)', body).group(1)
    elif "payment" in body and "completed" in body:
        transaction["type"] = "Payments to Code Holders"
        transaction["amount"] = int(re.search(r'(\d+) RWF', body).group(1))
        transaction["date"] = re.search(r'Date: (\S+ \S+)', body).group(1)
    elif "withdrawn" in body:
        transaction["type"] = "Withdrawals from Agents"
        transaction["amount"] = int(re.search(r'(\d+) RWF', body).group(1))
        transaction["date"] = re.search(r'on (\S+ \S+)', body).group(1)
    else:
        return None
    
    return transaction

# Example usage
file = 'sms_data.xml'
transactions = parse_xml(file)
print(transactions)
