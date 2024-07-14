$(document).ready(function() {
    
    let customers = [];
    let transactions = [];
    let chartDraw;
    
    $.getJSON('data.json', function(data) {
      customers = data.customers;
     
      loadTransactions();
    });
  
   
    $.getJSON('data.json', function(data) {
      transactions = data.transactions;
      
      loadTransactions();
    });
  
    
    function loadTransactions() {
      if (customers.length > 0 && transactions.length > 0) {
        let rows = '';
        transactions.forEach(function(transaction) {
          let customer = customers.find(c => c.id === transaction.customer_id);
          rows += `
            <tr>
              <td>${customer.name}</td>
              <td>${transaction.date}</td>
              <td>${transaction.amount}</td>
            </tr>
          `;
        });
        $('#transaction-table').html(rows);
        setupFilters();
      }
    }
  
    
    function setupFilters() {
      
      $('#filter-name').on('input', function() {
        let filteredTransactions = transactions.filter(transaction => {
          let customer = customers.find(c => c.id === transaction.customer_id);
          return customer.name.toLowerCase().includes($(this).val().toLowerCase());
        });
        displayTransactions(filteredTransactions);
      });
  
      
      $('#filter-amount').on('input', function() {
        let filteredTransactions = transactions.filter(transaction => transaction.amount >= $(this).val());
        displayTransactions(filteredTransactions);
      });
    }
  
   
    function displayTransactions(filteredTransactions) {
      let rows = '';
      filteredTransactions.forEach(function(transaction) {
        let customer = customers.find(c => c.id === transaction.customer_id);
        rows += `
          <tr>
            <td>${customer.name}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
          </tr>
        `;
      });
      $('#transaction-table').html(rows);
      drawChart(filteredTransactions);
    }
  
    
    function drawChart(filteredTransactions) {
      let ctx = document.getElementById('transaction-chart').getContext('2d');
      let transactionData = {};
      filteredTransactions.forEach(function(transaction) {
        if (!transactionData[transaction.date]) {
          transactionData[transaction.date] = 0;
        }
        transactionData[transaction.date] += transaction.amount;
      });
  
      let chartData = {
        labels: Object.keys(transactionData),
        datasets: [{
          label: 'Total Transaction Amount',
          data: Object.values(transactionData),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
      if(chartDraw) chartDraw.destroy();
      chartDraw = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        
      });
    }
  });
  