document.addEventListener("DOMContentLoaded", function () {
    const logo = document.querySelector(".logo");
    const navLinks = document.querySelectorAll(".nav-link");
    const navLinkTexts = document.querySelectorAll(".nav-link p");
    const home = document.querySelector(".home-section");
    const addFile = document.querySelector(".Add-file-section");
    const print = document.querySelector(".Print-section");
    const bot = document.querySelector(".bot-section");
    const fileInput = document.getElementById("file");
    let file_content = "";
    let tableContainer = document.getElementById("table");
    let transaction_types = document.querySelectorAll(".transaction-type .fil a");
    let currentTableType = "cashpower";
    let databaseData = {};
    let totaldata = {};
    let cashIn, cashOut, fees, balance;
    let airtime = [], bundles = [], cashpower = [], codeholders = [], deposit = [], failed = [], incoming = [], nontransaction = [], payments = [], reversedtransactions = [], thirdparty = [], transfer = [], withdraw = [];
  
    // Function to show loading overlay
    function showLoading(message) {
      let loadingDiv = document.getElementById("loading-overlay");
      if (!loadingDiv) {
        loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-overlay";
        loadingDiv.innerHTML = `<div class="loading-message">${message}</div>`;
        document.body.appendChild(loadingDiv);
      }
      loadingDiv.style.display = "flex";
    }
  
    // Function to hide loading overlay
    function hideLoading() {
      const loadingDiv = document.getElementById("loading-overlay");
      if (loadingDiv) {
        loadingDiv.style.display = "none";
      }
    }
  
    function resetFilters() {
      document.querySelector(".search input").value = "";
      document.querySelector(".calendar input").value = "";
    }
  
    // Function to show a section
    function showSection(sectionToShow) {
      const sections = [home, addFile, print, bot];
      sections.forEach((section) => (section.style.display = "none"));
      sectionToShow.style.display = "flex";
      if (sectionToShow === bot) {
        initializeCharts();
      }
    }
  
    // Chart initializer
    function initializeCharts() {
      const lineCtx = document.getElementById("lineChart").getContext("2d");
      const pieCtx = document.getElementById("pieChart").getContext("2d");
      const barCtx = document.getElementById("barChart").getContext("2d");
  
      const labels = ["January", "February", "March", "April", "May", "June", "July"];
      const airtimeData = airtime.map(item => item.Amount);
      const bundlesData = bundles.map(item => item.Amount);
      const cashpowerData = cashpower.map(item => item.Amount);
      const codeholdersData = codeholders.map(item => item.AMOUNT);
      const depositData = deposit.map(item => item.AMOUNT);
      const failedData = failed.map(item => item.AMOUNT);
      const incomingData = incoming.map(item => item.AMOUNT);
      const nontransactionData = nontransaction.map(item => item.AMOUNT);
      const paymentsData = payments.map(item => item.AMOUNT);
      const reversedtransactionsData = reversedtransactions.map(item => item.AMOUNT);
      const thirdpartyData = thirdparty.map(item => item.AMOUNT);
      const transferData = transfer.map(item => item.AMOUNT);
      const withdrawData = withdraw.map(item => item.AMOUNT);
  
      const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Airtime', data: airtimeData, borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 1, fill: false },
            { label: 'Bundles', data: bundlesData, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1, fill: false },
            { label: 'CashPower', data: cashpowerData, borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1, fill: false },
            { label: 'CodeHolders', data: codeholdersData, borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1, fill: false },
            { label: 'Deposit', data: depositData, borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1, fill: false },
            { label: 'Failed', data: failedData, borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1, fill: false },
            { label: 'Incoming', data: incomingData, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1, fill: false },
            { label: 'NonCash', data: nontransactionData, borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1, fill: false },
            { label: 'Payments', data: paymentsData, borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1, fill: false },
            { label: 'Reversed', data: reversedtransactionsData, borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1, fill: false },
            { label: 'ThirdParty', data: thirdpartyData, borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1, fill: false },
            { label: 'Transfer', data: transferData, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1, fill: false },
            { label: 'Withdraw', data: withdrawData, borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1, fill: false }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Month'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Value'
              }
            }
          }
        }
      });
  
      document.querySelectorAll('.line-controls input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
          const datasetIndex = lineChart.data.datasets.findIndex(dataset => dataset.label === this.dataset.line);
          lineChart.data.datasets[datasetIndex].hidden = !this.checked;
          lineChart.update();
        });
      });
  
      const spendingData = [
        airtimeData.reduce((a, b) => a + b, 0),
        bundlesData.reduce((a, b) => a + b, 0),
        cashpowerData.reduce((a, b) => a + b, 0),
        codeholdersData.reduce((a, b) => a + b, 0),
        transferData.reduce((a, b) => a + b, 0),
        withdrawData.reduce((a, b) => a + b, 0)
      ];
  
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Airtime', 'Bundles', 'CashPower', 'CodeHolders', 'Transfer', 'Withdraw'],
          datasets: [{
            data: spendingData,
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true
        }
      });
  
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            { label: 'Airtime', data: airtimeData, backgroundColor: 'rgba(255, 206, 86, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 1 },
            { label: 'Bundles', data: bundlesData, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
            { label: 'CashPower', data: cashpowerData, backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 },
            { label: 'CodeHolders', data: codeholdersData, backgroundColor: 'rgba(255, 159, 64, 0.2)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 },
            { label: 'Transfer', data: transferData, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 },
            { label: 'Withdraw', data: withdrawData, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }
          ]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Value'
              },
              max: Math.max(
                ...airtimeData,
                ...bundlesData,
                ...cashpowerData,
                ...codeholdersData,
                ...transferData,
                ...withdrawData
              )
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });
    }
  
    // Function to activate navigation link
    function activateNavLink(navLinkToActivate) {
      navLinks.forEach((navLink) => navLink.classList.remove("nav-link_activated"));
      navLinkToActivate.classList.add("nav-link_activated");
    }
  
    // Function to hide/show text
    function hideInfo() {
      navLinkTexts.forEach((navLinkText) => {
        navLinkText.style.display = navLinkText.style.display === "none" ? "flex" : "none";
      });
    }
  
    // Function to show alert messages
    function showAlert(message, isError = false) {
      const alertBox = document.createElement("div");
      alertBox.className = `custom-alert ${isError ? "error" : ""}`;
      alertBox.textContent = message;
      document.body.appendChild(alertBox);
      alertBox.classList.add("show");
      setTimeout(() => {
        alertBox.classList.remove("show");
        document.body.removeChild(alertBox);
      }, 3000);
    }
  
    // Function to fetch database results
    async function fetchDatabaseResults() {
      showLoading("Fetching database results...");
      try {
        const databaseResponse = await fetch("http://127.0.0.1:8000/database_return");
        if (!databaseResponse.ok) throw new Error("Database fetch failed.");
  
        databaseData = await databaseResponse.json();
        hideLoading();
        console.log("Database data:", databaseData);
        airtime = databaseData.airtime || [];
        bundles = databaseData.bundles || [];
        cashpower = databaseData.cashpower || [];
        codeholders = databaseData.codeholders || [];
        deposit = databaseData.deposit || [];
        failed = databaseData.failedtransactions || [];
        incoming = databaseData.incomingmoney || [];
        nontransaction = databaseData.nontransaction || [];
        payments = databaseData.payments || [];
        reversedtransactions = databaseData.reversedtransactions || [];
        thirdparty = databaseData.thirdparty || [];
        transfer = databaseData.transfer || [];
        withdraw = databaseData.withdraw || [];
  
        table_creator();
      } catch (error) {
        hideLoading();
        console.error(error);
      }
    }
  
    fileInput.addEventListener("change", async function (event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = async function (e) {
        file_content = e.target.result;
  
        if (file_content) {
          try {
            const response = await fetch("http://127.0.0.1:8000/file", {
              method: "POST",
              headers: { "Content-Type": "text/plain" },
              body: file_content
            });
  
            if (!response.ok) throw new Error("File upload failed.");
  
            const responseData = await response.json();
            hideLoading();
  
            fetchDatabaseResults();
          } catch (error) {
            hideLoading();
            console.error(error);
          }
        }
      };
      reader.readAsText(file);
    });
  
    // Function to create and display table
    function table_creator(filteredData) {
      totaldata = databaseData.data || {};
      airtime = totaldata.airtime || [];
      bundles = totaldata.bundles || [];
      cashpower = totaldata.cashpower || [];
      codeholders = totaldata.codeholders || [];
      deposit = totaldata.deposit || [];
      failed = totaldata.failedtransactions || [];
      incoming = totaldata.incomingmoney || [];
      nontransaction = totaldata.nontransaction || [];
      payments = totaldata.payments || [];
      reversedtransactions = totaldata.reversedtransactions || [];
      thirdparty = totaldata.thirdparty || [];
      transfer = totaldata.transfer || [];
      withdraw = totaldata.withdraw || [];
      tableContainer.innerHTML = "";
  
      const createTable = (data) => {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
  
        const headerRow = document.createElement("tr");
        const columns = Object.keys(data[0] || {});
        columns.forEach((col) => {
          const th = document.createElement("th");
          th.textContent = col;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
  
        data.forEach((row) => {
          const tr = document.createElement("tr");
          columns.forEach((col) => {
            const td = document.createElement("td");
            td.textContent = row[col] || 0;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
  
        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
      };
  
      const displayTable = (data) => {
        resetFilters();
        const table = createTable(data);
        tableContainer.appendChild(table);
      };
  
      displayTable(cashpower);
      setActiveButton(".cashpower");
      updateFinancialOverview();
  
      function setActiveButton(selector) {
        transaction_types.forEach((transaction_type) => {
          transaction_type.classList.remove("active");
        });
        document.querySelector(selector).classList.add("active");
      }
  
      const transactionHandlers = {
        ".cashpower": cashpower,
        ".codeholders": codeholders,
        ".airtime": airtime,
        ".bundles": bundles,
        ".incomingmoney": incoming,
        ".nontransaction": nontransaction,
        ".deposit": deposit,
        ".failedtransactions": failed,
        ".thirdparty": thirdparty,
        ".transfer": transfer,
        ".payments": payments,
        ".reversedtransactions": reversedtransactions,
        ".withdraw": withdraw
      };
  
      Object.keys(transactionHandlers).forEach((selector) => {
        document.querySelector(selector).addEventListener("click", () => {
          tableContainer.innerHTML = "";
          displayTable(transactionHandlers[selector]);
          setActiveButton(selector);
        });
      });
  
      document.getElementById("download-pdf-btn").addEventListener("click", downloadTablesAsPDF);
  
      function generatePrintTables() {
        const transactionTypes = [
          { name: "Airtime", data: airtime },
          { name: "Bundles", data: bundles },
          { name: "CashPower", data: cashpower },
          { name: "CodeHolders", data: codeholders },
          { name: "Deposit", data: deposit },
          { name: "Failed", data: failed },
          { name: "Incoming", data: incoming },
          { name: "NonCash", data: nontransaction },
          { name: "Payments", data: payments },
          { name: "Reversed", data: reversedtransactions },
          { name: "ThirdParty", data: thirdparty },
          { name: "Transfer", data: transfer },
          { name: "Withdraw", data: withdraw }
        ];
  
        const printTablesContainer = document.getElementById("print-tables");
        printTablesContainer.innerHTML = "";
  
        transactionTypes.forEach(type => {
          const table = createTable(type.data);
          const title = document.createElement("h3");
          title.textContent = type.name;
          printTablesContainer.appendChild(title);
          printTablesContainer.appendChild(table);
        });
      }
  
      function downloadTablesAsPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.setFontSize(18);
        pdf.text("Momo Analyst Report", 14, 22);
  
        const transactionTypes = [
          { name: "Airtime", data: airtime },
          { name: "Bundles", data: bundles },
          { name: "CashPower", data: cashpower },
          { name: "CodeHolders", data: codeholders },
          { name: "Deposit", data: deposit },
          { name: "Failed", data: failed },
          { name: "Incoming", data: incoming },
          { name: "NonCash", data: nontransaction },
          { name: "Payments", data: payments },
          { name: "Reversed", data: reversedtransactions },
          { name: "ThirdParty", data: thirdparty },
          { name: "Transfer", data: transfer },
          { name: "Withdraw", data: withdraw }
        ];
  
        let yOffset =