const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openModalBtn.addEventListener("click", function () {
    modal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
});


const leadForm = document.getElementById("leadForm");
const leadSuccess = document.getElementById("leadSuccess");

leadForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stops page from refreshing

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const destination = document.getElementById("destination").value;
    const budget = document.getElementById("budget").value;

    if (!name || !email || !destination || !budget) {
        leadSuccess.textContent = "Please fill in all fields.";
        leadSuccess.style.color = "red";
        return;
    }

    leadSuccess.textContent = "Lead Submitted Successfully!"
    leadSuccess.style.color ="green";
   
    setTimeout(function () {
        leadForm.reset();
    }, 500);
});


const campaignForm = document.getElementById("campaignForm");
const campaignSuccess = document.getElementById("campaignSuccess");

campaignForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("campaignName").value;
    const dest = document.getElementById("campaignDestinations").value;
    const budget = document.getElementById("campaignBudget").value;

    if (!name || !dest || !budget) {
        leadSuccess.textContent = "Please fill in all fields.";
        leadSuccess.style.color = "red";
        return;
    }

    campaignSuccess.textContent = "Campaign Created Successfully!"
    setTimeout(function () {
        campaignForm.reset();
        modal.classList.add("hidden")
    }, 500);
});