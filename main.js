const balance = document.getElementById("balance");
const money_minus = document.getElementById("money-minus");
const money_plus = document.getElementById("money-plus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

// Ternary operator
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transactions
function addTransaction(e) {
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value,
    };
    // Push into an array, add to DOM, update and delete input
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }

  e.preventDefault();
}

// Generate random ID
function generateId() {
  return Math.floor(Math.random() * 100000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // GET SIGN based on amount entered -- ternary operator
  const sign = transaction.amount < 0 ? "-" : "+";
  // Creating li
  const item = document.createElement("li");
  // Add class based on values
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  // Math.abs to make number positive without minus sign because sign its declared before transaction.amount
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
    `;
  // Append child into the list
  list.appendChild(item);
}

// Update balance, income and expenses
function updateValues() {
  // Map will loop through and will create a new array with amounts
  const amounts = transactions.map((transaction) => transaction.amount);
  // Reduce property will output single value from transaction amounts appended
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -(1).toFixed(2);

  balance.innerText = `$${total}`;
  money_minus.innerText = `$${expense}`;
  money_plus.innerText = `$${income}`;
}

function removeTransaction(id) {
  // Removes and filters out passed id
  transactions = transactions.filter((transaction) => transaction.id !== id);
  // Reload list after removal
  updateLocalStorage();
  init();
}

// Update local storage transactions

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
