//Variables

// Variables for currency converter
const currencyEL_one = document.getElementById("currencey-one");
const amountEl_one = document.getElementById("amount-one");
const currencyEL_two = document.getElementById("currency-two");
const amountEl_two = document.getElementById("amount-two");

const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

// Typing effect class
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = "";
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 300;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Functions

// Scroll effect for navbar
$(function () {
  $(document).scroll(function () {
    var $nav = $("#main-nav");
    $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});

// Smooth Scrolling
$("#main-nav a").on("click", function (event) {
  if (this.hash !== "") {
    event.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top,
      },
      800,
      function () {
        window.location.hash = hash;
      }
    );
  }
});

// FAQ Accordion
document.querySelectorAll(".accordion-button").forEach((button) => {
  // Add Event listner to each button
  button.addEventListener("click", () => {
    // Get the accordion-contnet div
    const accordionContent = button.nextElementSibling;

    // Toggle accordion-button-active class
    button.classList.toggle("accordion-button-active");

    if (button.classList.contains("accordion-button-active")) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    } else {
      accordionContent.style.maxHeight = 0;
    }
  });
});

// functions for currency converter
// fetch Exchange Rates and Update DOM
function calculate() {
  // Get the value of the select boxes
  const currency_one = currencyEL_one.value;
  const currency_two = currencyEL_two.value;

  // Fetch from the exchange api by appending the select value onto the request
  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    // Convert promise to json format
    .then((res) => res.json())
    .then((data) => {
      //get the rate of currency two
      const rate = data.rates[currency_two];
      // Up date the rate text
      rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      // Calculate the amount which is the value of amount 1 * rate fixed to 2 decimal places
      amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    });
}

// Action Listners

swap.addEventListener("click", () => {
  // Create a temp var to hold currency 1 value
  const temp = currencyEL_one.value;
  // Make curency 1 = to the value of currency 2
  currencyEL_one.value = currencyEL_two.value;
  // Make currency two value = to the value stored in temp(currencey 1)
  currencyEL_two.value = temp;
  calculate();
});

// Add EventListners for currency converter
currencyEL_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currencyEL_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);

// Init On DOM Load
document.addEventListener("DOMContentLoaded", init);

// Init typeWriter App
function init() {
  const txtElement = document.querySelector(".txt-type");
  const words = JSON.parse(txtElement.getAttribute("data-words"));
  const wait = txtElement.getAttribute("data-wait");
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait);
}

// Call caluclate function for converter
calculate();

//Get the current year for the copyright at the bottom of the page
$("#year").text(new Date().getFullYear());
