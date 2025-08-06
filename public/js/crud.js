// const companyList = {
//     AAPL: "Apple",
//     GOOGL: "Google",
//     MSFT: "Microsoft",
//     AMZN: "Amazon",
//     TSLA: "Tesla"
//   };
  
//   const companySelect = document.getElementById("company");
//   Object.entries(companyList).forEach(([symbol, name]) => {
//     const opt = document.createElement("option");
//     opt.value = symbol;
//     opt.textContent = name;
//     companySelect.appendChild(opt);
//   });
  
//   companySelect.addEventListener("change", async (e) => {
//     const symbol = e.target.value;
//     const res = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=41f6ea7d936343458b1b895847fe6459`);
//     const data = await res.json();
//     document.getElementById("symbol").value = data.symbol;
//     document.getElementById("current_price").value = data.price;
//   });
  
//   document.getElementById("buyForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const data = {
//       company_name: companyList[companySelect.value],
//       symbol: document.getElementById("symbol").value,
//       current_price: parseFloat(document.getElementById("current_price").value),
//       sector: document.getElementById("sector").value,
//       quantity: parseInt(document.getElementById("quantity").value),
//       amount_invested: parseFloat(document.getElementById("current_price").value) * parseInt(document.getElementById("quantity").value)
//     };
  
//     await fetch("/api/buy", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     });
  
//     const card = `
//       <div class="col-md-4 mt-3">
//         <div class="card shadow">
//           <div class="card-body">
//             <h5 class="card-title">${data.company_name}</h5>
//             <p>Symbol: ${data.symbol}</p>
//             <p>Sector: ${data.sector}</p>
//             <p>Quantity: ${data.quantity}</p>
//             <p>Invested: ₹${data.amount_invested}</p>
//           </div>
//         </div>
//       </div>
//     `;
//     document.getElementById("cards").innerHTML += card;
//   });
  
  
document.getElementById("buyForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const companySelect = document.getElementById("company");
    const symbolInput = document.getElementById("symbol");
    const sectorSelect = document.getElementById("sector");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const dateInput = document.getElementById("date");
    const remarksInput = document.getElementById("remarks");
  
    const data = {
      company: companySelect.value,
      symbol: symbolInput.value,
      sector: sectorSelect.value,
      price: parseFloat(priceInput.value),
      quantity: parseInt(quantityInput.value),
      date: dateInput.value,
      remarks: remarksInput.value
    };
  
    const res = await fetch("/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  
    const result = await res.json();
  
    if (result.success) {
      renderCard(result.data);
    } else {
      alert("Error: " + result.error);
    }
  });
  
  function renderCard(data) {
    const container = document.getElementById("cardContainer");
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${data.company} (${data.symbol})</h5>
        <p class="card-text">Sector: ${data.sector}</p>
        <p class="card-text">Price: ₹${data.price}</p>
        <p class="card-text">Quantity: ${data.quantity}</p>
        <p class="card-text">Date: ${data.date}</p>
        <p class="card-text">Remarks: ${data.remarks}</p>
      </div>
    `;
    container.prepend(card);
  }
  
