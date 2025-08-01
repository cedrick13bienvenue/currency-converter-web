// DOM Elements
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const resultSection = document.getElementById("resultSection");
const resultDisplay = document.getElementById("resultDisplay");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

// API Base URL - automatically detects environment
const API_BASE_URL =
  window.location.port === "5501" || window.location.port === "5500"
    ? "http://localhost:3000"
    : "";

// Popular currencies to show first
const popularCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
];

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  await loadCurrencies();
  setupEventListeners();
  setDefaultCurrencies();
});

// Load currencies from API
async function loadCurrencies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/currencies`);
    const data = await response.json();

    if (data.success) {
      populateCurrencySelects(data.currencies);
    } else {
      showError("Failed to load currencies");
    }
  } catch (error) {
    showError(
      "Failed to connect to server. Make sure the server is running on port 3000."
    );
    console.error("Error loading currencies:", error);
  }
}

// Populate currency select dropdowns
function populateCurrencySelects(currencies) {
  // Sort currencies: popular first, then alphabetical
  const sortedCurrencies = currencies.sort((a, b) => {
    const aIsPopular = popularCurrencies.includes(a.code);
    const bIsPopular = popularCurrencies.includes(b.code);

    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    if (aIsPopular && bIsPopular) {
      return (
        popularCurrencies.indexOf(a.code) - popularCurrencies.indexOf(b.code)
      );
    }
    return a.code.localeCompare(b.code);
  });

  // Clear existing options
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  // Add options to both selects
  sortedCurrencies.forEach((currency) => {
    const option1 = new Option(
      `${currency.code} - ${currency.name}`,
      currency.code
    );
    const option2 = new Option(
      `${currency.code} - ${currency.name}`,
      currency.code
    );
    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });
}

// Set default currencies
function setDefaultCurrencies() {
  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

// Setup event listeners
function setupEventListeners() {
  convertBtn.addEventListener("click", handleConvert);
  swapBtn.addEventListener("click", handleSwap);

  // Convert on Enter key
  amountInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  });

  // Auto-convert when values change (with debounce)
  let debounceTimer;
  [amountInput, fromSelect, toSelect].forEach((element) => {
    element.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (amountInput.value && fromSelect.value && toSelect.value) {
          handleConvert();
        }
      }, 500);
    });
  });
}

// Handle currency conversion
async function handleConvert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  // Validation
  if (!amount || amount <= 0) {
    showError("Please enter a valid amount");
    return;
  }

  if (!from || !to) {
    showError("Please select currencies");
    return;
  }

  // Show loading
  showLoading(true);
  hideError();
  hideResult();

  try {
    const response = await fetch(`${API_BASE_URL}/api/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, from, to }),
    });

    const data = await response.json();

    if (data.success) {
      showResult(amount, from, to, data.result, data.rate);
    } else {
      showError(data.error || "Conversion failed");
    }
  } catch (error) {
    showError("Failed to convert currency. Please try again.");
    console.error("Conversion error:", error);
  } finally {
    showLoading(false);
  }
}

// Handle currency swap
function handleSwap() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  // Auto-convert if amount is present
  if (amountInput.value && fromSelect.value && toSelect.value) {
    handleConvert();
  }
}

// Show conversion result
function showResult(amount, from, to, result, rate) {
  resultDisplay.innerHTML = `
        <h3>${formatCurrency(amount, from)} = ${formatCurrency(result, to)}</h3>
        <div class="rate-info">
            <p><strong>Exchange Rate:</strong></p>
            <p>1 ${from} = ${rate.toFixed(6)} ${to}</p>
            <p>1 ${to} = ${(1 / rate).toFixed(6)} ${from}</p>
        </div>
    `;

  resultSection.classList.add("show");
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

// Hide error message
function hideError() {
  errorMessage.classList.remove("show");
}

// Hide result
function hideResult() {
  resultSection.classList.remove("show");
}

// Show/hide loading
function showLoading(show) {
  if (show) {
    loading.classList.add("show");
    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";
  } else {
    loading.classList.remove("show");
    convertBtn.disabled = false;
    convertBtn.textContent = "Convert";
  }
}

// Format currency for display
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Handle offline/online status
window.addEventListener("online", () => {
  hideError();
  console.log("Connection restored");
});

window.addEventListener("offline", () => {
  showError("No internet connection. Please check your network.");
});
