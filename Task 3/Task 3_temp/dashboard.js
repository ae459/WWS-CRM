const data = {
    newInquiries: 18,
    bookingsPipeline: "$42K",
    upcomingTrips: 11,
    europeLeads: 6,
    totalTravelers: 34,
    avgBudget: "$3.8K"
};
document.getElementById("newInquiries").textContent = data.newInquiries;
document.getElementById("bookingsPipeline").textContent = data.bookingsPipeline;
document.getElementById("upcomingTrips").textContent = data.upcomingTrips;
document.getElementById("europeLeads").textContent = data.europeLeads;
document.getElementById("totalTravelers").textContent = data.totalTravelers;
document.getElementById("avgBudget").textContent = data.avgBudget;
const tooltip = document.getElementById("tooltip");
document.querySelectorAll(".metric-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        tooltip.textContent = card.dataset.tooltip;
        tooltip.style.opacity = "1";
    });
    card.addEventListener("mousemove", (e) => {
        tooltip.style.left = e.clientX + "px";
        tooltip.style.top = e.clientY + "px";
    });

    card.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
    });
});
