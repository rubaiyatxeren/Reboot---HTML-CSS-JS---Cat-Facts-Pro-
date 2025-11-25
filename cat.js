// DOM ELEMENT COLLECTING -----
const API_URL = "https://catfact.ninja/fact";
const output = document.getElementById("output");
const button = document.getElementById("fetchBtn");
let autoRefreshInterval = null;

async function fetchData() {
  // FOR EXCEPTION HANDLING USING TRY CATCH BLOCK
  try {
    // INITIALLY SHOWING A LOADING CONTENT INSIDE THE INNERHTML OF OUTPUT
    output.innerHTML = `<div class="loading"> 🔍 Finding an interesting cat fact... </div>`;
    // ONCE REQ TO FETCH BUTTON GOES DISABLED
    button.disabled = true;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} error.`);
    }

    const data = await response.json();

    output.innerHTML = `"${data.fact}"`;
  } catch (error) {
    console.log(error);
    output.innerHTML = `<div class="error">
                    😿 Oops! Failed to fetch cat fact.<br>
                    <small>${error.message}</small>
                </div>`;
  } finally {
    button.disabled = false;
  }
}

async function fetchMultiple(count) {
  const button = document.getElementById(`multiBtn${count}`);
  try {
    output.innerHTML = `<div class="loading">🔍 Finding ${count} interesting cat facts...</div>`;
    button.disabled = true;

    const facts = [];
    for (let i = 0; i < count; i++) {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Request ${i + 1} failed...`);
      const data = await response.json();
      facts.push(data.fact);
    }
    output.innerHTML = facts
      .map(
        (fact, index) =>
          `<div style="margin-bottom: 15px;">${index + 1}. ${fact}</div>`
      )
      .join("");
  } catch (error) {
    output.innerHTML = `<div class="error">Failed to fetch multiple facts</div>`;
  } finally {
    button.disabled = false;
  }
}

function toggleAutoRefresh() {
  const checkbox = document.getElementById("autoRefresh");

  if (checkbox.checked) {
    autoRefreshInterval = setInterval(fetchData, 10000);
    fetchData();
  } else {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
    }
  }
}

// INITIALLY LOAD DATA WHEN DISPLAY OPENS OR REFRESH
window.addEventListener("load", fetchData);
