const stats = [
  {
    label: "New Travel Inqs",
    value: "08",
    trend: "+12%",
    direction: "up",
    detail: "March 2026 data",
    note: "4 from Europe this week",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(219,234,254,0.92))"
  },
  {
    label: "Bookings Pipeline",
    value: "$128K",
    trend: "+9%",
    direction: "up",
    detail: "March 2026 data",
    note: "Luxury itineraries leading",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(254,215,170,0.88))"
  },
  {
    label: "Upcoming Trips",
    value: "14",
    trend: "+3",
    direction: "up",
    detail: "Next 30 days",
    note: "7 departures this week",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(220,252,231,0.88))"
  },
  {
    label: "Leads from Europe",
    value: "05",
    trend: "+18%",
    direction: "up",
    detail: "Top source region",
    note: "Paris and Rome campaigns",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(224,231,255,0.92))"
  },
  {
    label: "Follow-ups Due",
    value: "11",
    trend: "-2",
    direction: "down",
    detail: "Needs action today",
    note: "8 assigned to sales desk",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,237,213,0.92))"
  },
  {
    label: "Active Campaigns",
    value: "06",
    trend: "+1",
    direction: "up",
    detail: "Travel Campaigns live",
    note: "Summer Europe Blast launched",
    background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(240,253,250,0.94))"
  }
];

const statsGrid = document.getElementById("statsGrid");
const globalSearch = document.getElementById("globalSearch");
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const profileToggle = document.getElementById("profileToggle");
const profileDropdown = document.getElementById("profileDropdown");
const notificationBell = document.getElementById("notificationBell");
const leadForm = document.getElementById("leadForm");
const leadFormMessage = document.getElementById("leadFormMessage");
const resetLeadFormButton = document.getElementById("resetLeadForm");
const campaignModal = document.getElementById("campaignModal");
const openCampaignButtons = [
  document.getElementById("openCampaignModal"),
  document.getElementById("openCampaignFromSidebar")
].filter(Boolean);
const openLeadModal = document.getElementById("openLeadModal");
const closeCampaignModalButton = document.getElementById("closeCampaignModal");
const cancelCampaignModalButton = document.getElementById("cancelCampaignModal");
const campaignForm = document.getElementById("campaignForm");
const campaignMessage = document.getElementById("campaignMessage");
const appToast = document.getElementById("appToast");
const searchPlaceholders = [
  "Search leads, bookings, campaigns",
  "Search Paris inquiries, Tokyo bookings",
  "Search agents, travelers, destinations"
];

let searchPlaceholderIndex = 0;
let toastTimeout;

function renderStats() {
  statsGrid.innerHTML = stats
    .map(
      (card) => `
        <article class="stat-card card-surface" style="background:${card.background}" title="${card.detail}">
          <div class="stat-card__top">
            <div>
              <p class="stat-card__label">${card.label}</p>
              <h3 class="stat-card__value">${card.value}</h3>
            </div>
            <span class="stat-tooltip" aria-label="${card.detail}" title="${card.detail}">i</span>
          </div>
          <div class="stat-card__meta">
            <span class="stat-trend ${card.direction}">${card.direction === "up" ? "↗" : "↘"} ${card.trend}</span>
            <span>${card.note}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function cycleSearchPlaceholder() {
  window.setInterval(() => {
    searchPlaceholderIndex = (searchPlaceholderIndex + 1) % searchPlaceholders.length;
    globalSearch.placeholder = searchPlaceholders[searchPlaceholderIndex];
  }, 2800);
}

function showToast(message) {
  appToast.textContent = message;
  appToast.hidden = false;
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    appToast.hidden = true;
  }, 2400);
}

function setProfileMenuState(expanded) {
  profileToggle.setAttribute("aria-expanded", String(expanded));
  profileDropdown.hidden = !expanded;
}

function getLeadPayload() {
  const budgetValue = document.getElementById("leadBudget").value;
  return {
    name: document.getElementById("leadName").value.trim(),
    email: document.getElementById("leadEmail").value.trim(),
    phone: document.getElementById("leadPhone").value.trim(),
    destination: document.getElementById("leadDestination").value.trim(),
    travelStartDate: document.getElementById("leadStartDate").value,
    travelEndDate: document.getElementById("leadEndDate").value,
    numberOfTravelers: Number.parseInt(document.getElementById("leadTravelers").value, 10),
    budget: budgetValue === "" ? undefined : Number(budgetValue),
    notes: document.getElementById("leadNotes").value.trim()
  };
}

function validateTravelInquiry(payload) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidDateString = (value) => typeof value === "string" && value !== "" && !Number.isNaN(new Date(value).getTime());

  if (!payload.name) {
    errors.push({ field: "name", message: "Name is required." });
  }

  if (!payload.email) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!emailPattern.test(payload.email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }

  if (payload.phone && typeof payload.phone !== "string") {
    errors.push({ field: "phone", message: "Phone must be text." });
  }

  if (!payload.destination) {
    errors.push({ field: "destination", message: "Destination is required." });
  }

  if (!isValidDateString(payload.travelStartDate)) {
    errors.push({ field: "travelStartDate", message: "Start date is required." });
  }

  if (!isValidDateString(payload.travelEndDate)) {
    errors.push({ field: "travelEndDate", message: "End date is required." });
  }

  if (!Number.isInteger(payload.numberOfTravelers)) {
    errors.push({ field: "numberOfTravelers", message: "Traveler count is required." });
  } else if (payload.numberOfTravelers < 1 || payload.numberOfTravelers > 20) {
    errors.push({ field: "numberOfTravelers", message: "Travelers must be between 1 and 20." });
  }

  if (
    isValidDateString(payload.travelStartDate) &&
    isValidDateString(payload.travelEndDate) &&
    new Date(payload.travelEndDate) <= new Date(payload.travelStartDate)
  ) {
    errors.push({ field: "travelEndDate", message: "End date must be after the start date." });
  }

  if (payload.budget !== undefined && (Number.isNaN(payload.budget) || payload.budget < 0)) {
    errors.push({ field: "budget", message: "Budget must be a non-negative number." });
  }

  if (payload.notes && typeof payload.notes !== "string") {
    errors.push({ field: "notes", message: "Notes must be text." });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function clearLeadErrors() {
  leadForm.querySelectorAll("input, textarea").forEach((field) => field.classList.remove("input-error"));
  leadForm.querySelectorAll("[data-error-for]").forEach((field) => {
    field.textContent = "";
  });
  leadFormMessage.textContent = "";
  leadFormMessage.className = "form-message";
}

function setLeadFormMessage(text, type) {
  leadFormMessage.textContent = text;
  leadFormMessage.className = `form-message ${type}`;
}

function bindNavRoutingStubs() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const route = button.dataset.route || "Dashboard";
      pageTitle.textContent = route === "Dashboard" ? "Dashboard Overview" : route;
      showToast(`${route} section opened`);
      sidebar.classList.remove("is-open");
    });
  });
}

function bindTableRowActions() {
  document.querySelectorAll("tbody tr").forEach((row) => {
    const onSelect = () => {
      const rowSummary = row.innerText.replace(/\s+/g, " ").trim();
      window.alert(`Open record stub: ${rowSummary}`);
    };

    row.addEventListener("click", onSelect);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    });
  });
}

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector("tbody");
  const rows = [...tbody.querySelectorAll("tr")];
  const nextDirection = table.dataset.sortDirection === "asc" ? "desc" : "asc";

  rows.sort((rowA, rowB) => {
    const valueA = rowA.children[columnIndex].innerText.trim().toLowerCase();
    const valueB = rowB.children[columnIndex].innerText.trim().toLowerCase();
    return nextDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  tbody.replaceChildren(...rows);
  table.dataset.sortDirection = nextDirection;
  bindTableRowActions();
}

function bindTableSorting() {
  document.querySelectorAll(".sort-button").forEach((button) => {
    button.addEventListener("click", () => {
      sortTable(button.dataset.table, Number(button.dataset.column));
      showToast(`Sorted ${button.closest("table").id.replace("Table", "")} by ${button.textContent}`);
    });
  });
}

function openCampaignModal() {
  campaignModal.hidden = false;
  document.body.style.overflow = "hidden";
  campaignMessage.textContent = "";
  campaignMessage.className = "form-message";
}

function closeCampaignModal() {
  campaignModal.hidden = true;
  document.body.style.overflow = "";
}

function bindCampaignModal() {
  openCampaignButtons.forEach((button) => button.addEventListener("click", openCampaignModal));
  closeCampaignModalButton.addEventListener("click", closeCampaignModal);
  cancelCampaignModalButton.addEventListener("click", closeCampaignModal);

  campaignModal.addEventListener("click", (event) => {
    if (event.target === campaignModal) {
      closeCampaignModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCampaignModal();
      setProfileMenuState(false);
    }
  });
}

function bindHeaderActions() {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
  });

  profileToggle.addEventListener("click", () => {
    const expanded = profileToggle.getAttribute("aria-expanded") === "true";
    setProfileMenuState(!expanded);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-menu")) {
      setProfileMenuState(false);
    }
  });

  globalSearch.addEventListener("focus", () => {
    globalSearch.placeholder = "Try: Paris, Campaigns, Nadia";
  });

  globalSearch.addEventListener("blur", () => {
    globalSearch.placeholder = searchPlaceholders[searchPlaceholderIndex];
  });

  notificationBell.addEventListener("click", () => {
    showToast("3 new updates in your travel pipeline");
  });

  openLeadModal.addEventListener("click", () => {
    leadForm.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("leadName").focus();
  });
}

function bindLeadForm() {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearLeadErrors();

    const payload = getLeadPayload();
    const result = validateTravelInquiry(payload);

    if (!result.valid) {
      result.errors.forEach(({ field, message }) => {
        const input = leadForm.querySelector(`[name="${field}"]`);
        const error = leadForm.querySelector(`[data-error-for="${field}"]`);
        if (input) {
          input.classList.add("input-error");
        }
        if (error) {
          error.textContent = message;
        }
      });

      setLeadFormMessage("Please correct the highlighted fields.", "error");
      return;
    }

    setLeadFormMessage("Lead saved successfully. Mock submission complete.", "success");
    showToast(`Lead added for ${payload.destination}`);
    leadForm.reset();
  });

  resetLeadFormButton.addEventListener("click", () => {
    leadForm.reset();
    clearLeadErrors();
  });
}

function bindCampaignForm() {
  campaignForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = ["campaignName", "campaignDestinations", "campaignBudgetRange", "campaignLaunchDate", "campaignOwner"];
    const missingField = fields.find((fieldId) => !document.getElementById(fieldId).value.trim());

    if (missingField) {
      campaignMessage.textContent = "Complete all campaign fields before submitting.";
      campaignMessage.className = "form-message error";
      return;
    }

    campaignMessage.textContent = "Campaign created successfully. Demo workflow only.";
    campaignMessage.className = "form-message success";
    showToast("Travel campaign created");
    window.setTimeout(() => {
      campaignForm.reset();
      closeCampaignModal();
    }, 900);
  });
}

renderStats();
cycleSearchPlaceholder();
bindNavRoutingStubs();
bindTableRowActions();
bindTableSorting();
bindCampaignModal();
bindHeaderActions();
bindLeadForm();
bindCampaignForm();
setProfileMenuState(false);
