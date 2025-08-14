const form = document.getElementById("form");
const amountInput = document.getElementById("amount");
const fromContainer = document.getElementById("from");
const toContainer = document.getElementById("to");
const convertBtn = document.getElementById("convert");
const errorContainer = document.getElementById("error-container");
const errorText = document.getElementById("error-text");
const result = document.getElementById("result");
const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD";

renderCurrencies(fromContainer);
renderCurrencies(toContainer);

async function renderCurrencies(fromContainer) {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("An Error occured");
    }
    const { rates } = await res.json();
    for (const rate of Object.keys(rates)) {
      if (rate !== "USD") {
        const html = `<option value="${rate}">${rate}</option>`;
        fromContainer.innerHTML += html;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

convertBtn.addEventListener("click", convertCurrencies);

async function convertCurrencies(e) {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const from = fromContainer.value;
  const to = toContainer.value;
  result.innerHTML = "";

  if (
    amountInput.value === "" ||
    amount <= 0 ||
    !isFinite(amount) | (amountInput.value[0] === "0")
  ) {
    errorContainer.classList.add("active");
    errorText.textContent = "Please Enter a Valid Amount";
    setTimeout(() => {
      errorContainer.classList.remove("active");
    }, 1500);
    form.reset();
    return;
  }
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${from}`
  );
  const data = await response.json();
  const finalResult = data.rates[to] * amount;
  result.textContent = `Conversion of ${amount} ${from} is ${finalResult.toFixed(
    2
  )} ${to}`;
}
