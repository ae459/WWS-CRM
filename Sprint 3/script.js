document.addEventListener('DOMContentLoaded', () => {

    // --- Sidebar navigation ---
    const navLinks = document.querySelectorAll(".nav-link");
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('show'));
    }

    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                navLinks.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
                // In a real app, you would load page content here.
                showToast(`${this.dataset.page} section opened`);
                if (sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });
        });
    }

    // --- Header Actions ---
    const profileToggle = document.getElementById("profileToggle");
    const profileDropdown = document.getElementById("profileDropdown");
    const notificationBell = document.getElementById("notificationBell");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const openLeadModal = document.getElementById("openLeadModal");

    function setProfileMenuState(expanded) {
        if (!profileToggle || !profileDropdown) return;
        profileToggle.setAttribute("aria-expanded", String(expanded));
        profileDropdown.hidden = !expanded;
    }

    function setNotificationMenuState(expanded) {
        if (!notificationBell || !notificationDropdown) return;
        notificationBell.setAttribute("aria-expanded", String(expanded));
        notificationDropdown.hidden = !expanded;
    }

    if (profileToggle) {
        profileToggle.addEventListener("click", () => {
            const expanded = profileToggle.getAttribute("aria-expanded") === "true";
            setProfileMenuState(!expanded);
        });
    }

    if (notificationBell) {
        notificationBell.addEventListener("click", () => {
            const expanded = notificationBell.getAttribute("aria-expanded") === "true";
            setNotificationMenuState(!expanded);
        });
    }
    
    if(openLeadModal) {
        openLeadModal.addEventListener("click", () => {
            const leadForm = document.getElementById("travelForm");
            if (leadForm) {
                leadForm.scrollIntoView({ behavior: "smooth", block: "center" });
                document.getElementById("name").focus();
            }
        });
    }

    document.addEventListener("click", (event) => {
        if (profileToggle && !event.target.closest(".profile-menu")) {
            setProfileMenuState(false);
        }

        if (notificationBell && !event.target.closest(".notification-menu")) {
            setNotificationMenuState(false);
        }
    });

    // --- Travel Form (Quick Entry) Validation ---
    const travelForm = document.getElementById("travelForm");
    const leadFormMessage = document.getElementById("leadFormMessage");
    const resetLeadFormButton = document.getElementById("resetLeadForm");

    function clearLeadErrors() {
        if (!travelForm) return;
        travelForm.querySelectorAll("input, textarea").forEach((field) => field.style.borderColor = '#ccc');
        travelForm.querySelectorAll(".field-error").forEach((field) => {
            field.textContent = "";
        });
        if(leadFormMessage) {
            leadFormMessage.textContent = "";
            leadFormMessage.className = "form-message";
        }
    }

    function validateTravelInquiry(payload) {
        const errors = [];
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidDateString = (value) => typeof value === "string" && value !== "" && !isNaN(new Date(value).getTime());

        if (!payload.name) errors.push({ field: "name", message: "Name is required." });
        if (!payload.email) errors.push({ field: "email", message: "Email is required." });
        else if (!emailPattern.test(payload.email)) errors.push({ field: "email", message: "Enter a valid email address." });
        if (!payload.destination) errors.push({ field: "destination", message: "Destination is required." });
        if (!isValidDateString(payload.travelStartDate)) errors.push({ field: "travelStartDate", message: "Start date is required." });
        if (!isValidDateString(payload.travelEndDate)) errors.push({ field: "travelEndDate", message: "End date is required." });
        if (isValidDateString(payload.travelStartDate) && isValidDateString(payload.travelEndDate) && new Date(payload.travelEndDate) <= new Date(payload.travelStartDate)) {
            errors.push({ field: "travelEndDate", message: "End date must be after start date." });
        }
        if (!payload.numberOfTravelers) errors.push({ field: "numberOfTravelers", message: "Traveler count is required." });
        else if (payload.numberOfTravelers < 1 || payload.numberOfTravelers > 20) errors.push({ field: "numberOfTravelers", message: "Travelers must be 1-20." });

        return { valid: errors.length === 0, errors };
    }

    if (travelForm) {
        travelForm.addEventListener("submit", function (e) {
            e.preventDefault();
            clearLeadErrors();
            
            const payload = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                destination: document.getElementById("destination").value,
                travelStartDate: document.getElementById("travelStartDate").value,
                travelEndDate: document.getElementById("travelEndDate").value,
                numberOfTravelers: document.getElementById("numberOfTravelers").value,
                budget: document.getElementById("budget").value,
                notes: document.getElementById("notes").value,
            };

            const result = validateTravelInquiry(payload);

            if (!result.valid) {
                result.errors.forEach(({ field, message }) => {
                    const input = travelForm.querySelector(`[name="${field}"]`);
                    const errorEl = travelForm.querySelector(`[data-error-for="${field}"]`);
                    if (input) input.style.borderColor = 'red';
                    if (errorEl) errorEl.textContent = message;
                });
                if (leadFormMessage) {
                    leadFormMessage.textContent = "Please correct the highlighted fields.";
                    leadFormMessage.className = "form-message error";
                }
                return;
            }
            
            if (leadFormMessage) {
                leadFormMessage.textContent = "Lead saved successfully!";
                leadFormMessage.className = "form-message success";
            }
            showToast(`Lead added for ${payload.destination}`);
            setTimeout(() => {
                travelForm.reset();
                clearLeadErrors();
                // Set dates back to today
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('travelStartDate').value = today;
                document.getElementById('travelEndDate').value = today;
                document.getElementById('numberOfTravelers').value = 2;
            }, 2000);
        });

        if (resetLeadFormButton) {
            resetLeadFormButton.addEventListener('click', () => {
                clearLeadErrors();
                travelForm.reset();
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('travelStartDate').value = today;
                document.getElementById('travelEndDate').value = today;
                document.getElementById('numberOfTravelers').value = 2;
            });
        }
        
        // Set default dates and travelers
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('travelStartDate').value = today;
        document.getElementById('travelEndDate').value = today;
        document.getElementById('numberOfTravelers').value = 2;
    }

    // --- Tooltip for metric cards ---
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
        const metricCards = document.querySelectorAll(".metric-card");
        const tooltips = [
            "Total new inquiries received this cycle.",
            "Value of all bookings currently in the pipeline.",
            "Confirmed trips scheduled for departure soon.",
            "New leads generated from European campaigns.",
            "Number of follow-up tasks currently due.",
            "Total active marketing campaigns."
        ];

        metricCards.forEach((card, index) => {
            const infoIcon = card.querySelector('.fa-info-circle');
            if (!infoIcon) return;

            infoIcon.addEventListener("mouseenter", (e) => {
                tooltip.textContent = tooltips[index] || "Metric details.";
                tooltip.style.opacity = "1";
                tooltip.style.left = (e.clientX + 15) + "px";
                tooltip.style.top = (e.clientY + 15) + "px";
            });
            infoIcon.addEventListener("mousemove", (e) => {
                tooltip.style.left = (e.clientX + 15) + "px";
                tooltip.style.top = (e.clientY + 15) + "px";
            });
            infoIcon.addEventListener("mouseleave", () => {
                tooltip.style.opacity = "0";
            });
        });
    }

    // --- Toast Notification ---
    const appToast = document.getElementById("appToast");
    let toastTimeout;
    function showToast(message) {
        if (!appToast) return;
        appToast.textContent = message;
        appToast.hidden = false;
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => {
            appToast.hidden = true;
        }, 2400);
    }

    // --- Campaign Modal ---
    const campaignModal = document.getElementById("campaignModal");
    const openCampaignButtons = [
        document.getElementById("openCampaignModal"),
        document.getElementById("openCampaignFromSidebar")
    ].filter(Boolean);
    const closeCampaignModalButton = document.getElementById("closeCampaignModal");
    const cancelCampaignModalButton = document.getElementById("cancelCampaignModal");
    const campaignForm = document.getElementById("campaignForm");
    const campaignMessage = document.getElementById("campaignMessage");

    function openCampaignModal() {
        if (!campaignModal) return;
        campaignModal.hidden = false;
        document.body.style.overflow = "hidden";
        if(campaignMessage) {
            campaignMessage.textContent = "";
            campaignMessage.className = "form-message";
        }
    }

    function closeCampaignModal() {
        if (!campaignModal) return;
        campaignModal.hidden = true;
        document.body.style.overflow = "";
    }

    openCampaignButtons.forEach(btn => btn.addEventListener("click", openCampaignModal));
    if(closeCampaignModalButton) closeCampaignModalButton.addEventListener("click", closeCampaignModal);
    if(cancelCampaignModalButton) cancelCampaignModalButton.addEventListener("click", closeCampaignModal);
    
    if(campaignModal) {
        campaignModal.addEventListener("click", (event) => {
            if (event.target === campaignModal) closeCampaignModal();
        });
    }

    if (campaignForm) {
        campaignForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = ["campaignName", "campaignDestinations", "campaignBudgetRange", "campaignLaunchDate", "campaignOwner"];
            const missingField = fields.find((fieldId) => !document.getElementById(fieldId).value.trim());

            if (missingField) {
                if(campaignMessage) {
                    campaignMessage.textContent = "Complete all campaign fields before submitting.";
                    campaignMessage.className = "form-message error";
                }
                return;
            }
            
            if(campaignMessage) {
                campaignMessage.textContent = "Campaign created successfully.";
                campaignMessage.className = "form-message success";
            }
            showToast("Travel campaign created");
            window.setTimeout(() => {
                campaignForm.reset();
                closeCampaignModal();
            }, 900);
        });
    }

    // --- Table Sorting ---
    function sortTable(tableId, columnIndex) {
        const table = document.getElementById(tableId);
        if (!table) return;
        const tbody = table.querySelector("tbody");
        const rows = [...tbody.querySelectorAll("tr")];
        const headerButton = table.querySelector(`[data-column="${columnIndex}"]`);
        const currentDirection = headerButton.dataset.sort || 'desc';
        const nextDirection = currentDirection === "asc" ? "desc" : "asc";

        rows.sort((rowA, rowB) => {
            const valueA = rowA.children[columnIndex].innerText.trim().toLowerCase();
            const valueB = rowB.children[columnIndex].innerText.trim().toLowerCase();
            return nextDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        tbody.replaceChildren(...rows);
        table.querySelectorAll('.sort-button').forEach(btn => btn.dataset.sort = '');
        headerButton.dataset.sort = nextDirection;
    }

    document.querySelectorAll(".sort-button").forEach((button) => {
        button.addEventListener("click", () => {
            sortTable(button.dataset.table, Number(button.dataset.column));
            showToast(`Sorted ${button.closest("table").id.replace("Table", "")} by ${button.textContent}`);
        });
    });

    // --- Global Keydowns ---
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCampaignModal();
            setProfileMenuState(false);
            setNotificationMenuState(false);
        }
    });

    setProfileMenuState(false); // Initial state
    setNotificationMenuState(false); // Initial state
});

