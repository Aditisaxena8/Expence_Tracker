const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const filterCategory = document.getElementById("filterCategory");
const filterDate = document.getElementById("filterDate");

async function fetchExpenses() {
  const res = await fetch("/expenses");
  const expenses = await res.json();//here converting exppense into js
  renderExpenses(expenses);
}

function renderExpenses(expenses) {
  expenseTableBody.innerHTML = ""; // Clear existing rows
  expenses.forEach(expense => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>${expense.notes}</td>
    `;
    expenseTableBody.appendChild(row);
  });
}
expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  //Here in click of button from id value is being stored in expense
  const expense = {
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    notes: document.getElementById("notes").value,
  };
  await fetch("/add-expense", {//here 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  // alert("Expense added!");
  setTimeout(() => {alertMessage.style.display = 'none';}, 2000);
  fetchExpenses(); // Refresh the list
});

[filterCategory, filterDate].forEach(filter => {
  filter.addEventListener("input", async () => {
    const res = await fetch(
      `/expenses?category=${filterCategory.value}&date=${filterDate.value}`
    );
    const expenses = await res.json();
    renderExpenses(expenses);
  });
});

fetchExpenses(); // Initial fetch
