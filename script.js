// Fetch transaction data and create chart
const ctx = document.getElementById('transaction-chart').getContext('2d');
const transactionTypeSelect = document.getElementById('transaction-type');

const fetchData = async (type) => {
    const response = await fetch('/get-data?type=' + type);
    const data = await response.json();
    return data;
};

const createChart = (data) => {
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Transaction Volume',
                data: data.values,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
};

transactionTypeSelect.addEventListener('change', async (e) => {
    const type = e.target.value;
    const data = await fetchData(type);
    createChart(data);
});

// Initial data load
window.onload = async () => {
    const data = await fetchData('all');
    createChart(data);
};
