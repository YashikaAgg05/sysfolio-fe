// Toggle Mode
document.getElementById('toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Last 5 investments
fetch('/api/investments')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#last-investments tbody');
    tbody.innerHTML = '';
    data.slice(-5).reverse().forEach(inv => {
      const row = `<tr>
        <td>${inv.company}</td>
        <td>${inv.symbol}</td>
        <td>₹${inv.amount_invested}</td>
        <td>₹${inv.current_value}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  });

// Portfolio status for both top section and card values
//fetch('/api/portfolio-status'
  //.then(res => res.json())
  //.then(data => {
    //const profit = data.profit_loss;
    //const total = data.total_invested;
    //const current = data.total_current;

    // Set top section
    //const statusDiv = document.getElementById('portfolio-status');
    //let color = 'text-secondary';
    //if (profit > 0) color = 'text-success';
    //else if (profit < 0) color = 'text-danger';

    //statusDiv.innerHTML = `
      //<h5>Total Invested: ₹${total}</h5>
      //<h5>Current Value: ₹${current}</h5>
      //<h5 class="${color}">Profit/Loss: ₹${profit}</h5>
    //`;

    // Update card values
    //document.getElementById('total-invested').innerText = `₹${total}`;
    //const currentValueElem = document.getElementById('current-value');
    //currentValueElem.innerText = `₹${current}`;

    // Set green/red dynamically
    //currentValueElem.classList.remove('text-success', 'text-danger', 'text-secondary');
    //currentValueElem.classList.add(profit >= 0 ? 'text-success' : 'text-danger');
  //});

// Portfolio summary section
fetch('/api/portfolio-status')
  .then(res => res.json())
  .then(data => {
    const profit = data.profit_loss;
    const total = data.total_invested;
    const current = data.total_current;

    // Update values
    document.getElementById('total-invested').innerText = `₹${total}`;
    document.getElementById('current-value').innerText = `₹${current}`;

    const profitElem = document.getElementById('profit-loss');
    profitElem.innerText = `₹${profit}`;

    // Apply color based on value
    profitElem.classList.remove('text-success', 'text-danger', 'text-secondary');
    if (profit > 0) profitElem.classList.add('text-success');
    else if (profit < 0) profitElem.classList.add('text-danger');
    else profitElem.classList.add('text-secondary');
  });

// Sector Pie Chart
fetch('/api/chart-data')
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => d.sector);
    const values = data.map(d => d.total);
    new Chart(document.getElementById('sectorChart'), {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sectors',
          data: values,
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
            '#20c997', '#fd7e14', '#17a2b8', '#6610f2'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  });

// Dummy profit chart (replace with DB data if needed)
new Chart(document.getElementById('profitLossChart'), {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Profit',
      data: [3000, 2000, 5000, 4000, 6000, 4500],
      borderColor: '#28a745',
      fill: false,
      tension: 0.1
    }]
  }
});
