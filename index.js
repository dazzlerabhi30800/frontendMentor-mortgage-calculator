const resultWrapper = document.querySelector("#result--wrapper");
const form = document.querySelector("form");
const inputs = document.querySelectorAll(".field--input");
const mortgageTypes = document.querySelectorAll(".mortgage--type");
const inputChecks = document.querySelectorAll('input[type="checkbox"]');

const symbol = "€";

const clearAllBtn = document.querySelector('#clear--btn');



// NOTE: ->  Reset all fields
clearAllBtn.onclick = () => {
  window.location.reload();
}


// Info Wrapper elements
const heading = document.querySelector("h3");
const info = document.querySelector("#content--info");
const emptyImg = document.getElementById("empty--img");

const amountInput = document.querySelector("input#amount");

const amountWrapper = document.getElementById("amount--wrapper");
const interestText = amountWrapper.querySelector("#amount--text");
const totalAmountText = amountWrapper.querySelector("#total--amount");

const digitRegex = /(\d)(?=(\d{3})+(?!\d))/g;

const loanType = {
  mortgageInterest: "Interest Only",
  repayment: "Repayment",
};

// NOTE: -> to format amount
function formatNumberWithCommas(number) {
  const parts = number.toString().split(".");
  const leftStr = parts[0].replace(digitRegex, ",");
  let decPart = parts.length > 1 ? parts[1].slice(0, 2) : "";
  return leftStr + "." + decPart;
}

// NOTE: -> to populate info wrapper
function populateInfo(amount, installments) {
  if (!amount || !installments) return;
  emptyImg.style.display = "none";
  totalAmountText.textContent = symbol + formatNumberWithCommas(amount);
  interestText.textContent = symbol + formatNumberWithCommas(installments);
  amountWrapper.classList.replace("hidden", "block");
}

// NOTE: -> on the form success
function formSuccess() {
  const obj = {};
  inputs.forEach((input) => (obj[input.name] = input.value));
  const { amount, term, interest } = obj;
  const interestRate = interest / 12 / 100;
  const totalPayments = term * 12;
  const monthlyPayment = (
    parseInt(amount.replace(",", "")) *
    ((interestRate * Math.pow(1 + interestRate, totalPayments)) /
      (Math.pow(1 + interestRate, totalPayments) - 1))
  ).toFixed(2);
  const totalAmount = (monthlyPayment * term * 12).toFixed(2);
  populateInfo(totalAmount, monthlyPayment);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  inputs.forEach((input) => {
    if (input.value === "" || input.value === 0) {
      input.classList.add("error");
    } else {
      input.classList.remove("error");
    }
  });
  const isErrorInput = [...inputs.values()].some((el) =>
    el.classList.contains("error"),
  );
  const isChecked = [...inputChecks.values()].some(
    (input) => input.checked === true,
  );
  if (!isErrorInput && isChecked) {
    formSuccess();
  }
});

mortgageTypes.forEach((el) => {
  const input = el.querySelector('input[type="checkbox"]');
  el.addEventListener("click", () => {
    inputChecks.forEach((input) => (input.checked = false));
    mortgageTypes.forEach((el) => el.classList.remove("selected"));
    if (input) {
      input.checked = !input.checked;
      if (input.checked) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    }
  });
});

// NOTE: -> to format the amount on changing input
amountInput.oninput = (e) => {
  if (isNaN(parseInt(e.target.value))) {
    amountInput.value = "";
    return;
  }
  let value = e.target.value.replace(/,/g, ""); // Remove commas
  if (!/^\d*\.?\d*$/.test(value)) return; // Allow only numbers and a decimal

  e.target.value = Number(value).toLocaleString("en-US"); // Format with commas
};
