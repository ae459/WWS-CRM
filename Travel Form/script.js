const form = document.getElementById("travelForm");
const message = document.getElementById("message");
const API_BASE_URL =
window.API_BASE_URL ||
"https://wws-crm-production.up.railway.app";
const BACKEND_URL = `${API_BASE_URL.replace(/\/$/, "")}/api/travel-inquiry`;

const fieldIds = [
"name",
"email",
"phone",
"destination",
"travelStartDate",
"travelEndDate",
"numberOfTravelers",
"budget",
"notes"
];

function clearFieldErrors(){
fieldIds.forEach((id) => {
const input = document.getElementById(id);
const error = document.getElementById(`${id}Error`);
if(input){
input.classList.remove("input-error");
}
if(error){
error.textContent = "";
}
});
}

function setFieldError(fieldId, text){
const input = document.getElementById(fieldId);
const error = document.getElementById(`${fieldId}Error`);
if(input){
input.classList.add("input-error");
}
if(error){
error.textContent = text;
}
}

function setOverallMessage(text, type){
message.textContent = text;
message.classList.remove("success", "error");
if(type){
message.classList.add(type);
}
}

form.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();
const destination = document.getElementById("destination").value.trim();
const travelStartDate = document.getElementById("travelStartDate").value;
const travelEndDate = document.getElementById("travelEndDate").value;
const numberOfTravelers = parseInt(document.getElementById("numberOfTravelers").value, 10);
const budgetInput = document.getElementById("budget").value;
const notes = document.getElementById("notes").value.trim();
const budget = budgetInput === "" ? undefined : Number(budgetInput);

clearFieldErrors();
setOverallMessage("", "");

let hasErrors = false;

if(!name){
setFieldError("name", "Name is required.");
hasErrors = true;
}

if(!email){
setFieldError("email", "Email is required.");
hasErrors = true;
}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
setFieldError("email", "Please enter a valid email.");
hasErrors = true;
}

if(!destination){
setFieldError("destination", "Destination is required.");
hasErrors = true;
}

if(!travelStartDate){
setFieldError("travelStartDate", "Start date is required.");
hasErrors = true;
}

if(!travelEndDate){
setFieldError("travelEndDate", "End date is required.");
hasErrors = true;
}

if(Number.isNaN(numberOfTravelers)){
setFieldError("numberOfTravelers", "Number of travelers is required.");
hasErrors = true;
}else if(numberOfTravelers <= 0 || numberOfTravelers > 20){
setFieldError("numberOfTravelers", "Travelers must be between 1 and 20.");
hasErrors = true;
}

if(travelStartDate && travelEndDate && new Date(travelStartDate) >= new Date(travelEndDate)){
setFieldError("travelEndDate", "End date must be after start date.");
hasErrors = true;
}

if(budget !== undefined && (Number.isNaN(budget) || budget < 0)){
setFieldError("budget", "Budget must be a non-negative number.");
hasErrors = true;
}

if(hasErrors){
setOverallMessage("Please fix the highlighted fields and try again.", "error");
return;
}
  
const data = {
name,
email,
phone,
destination,
travelStartDate,
travelEndDate,
numberOfTravelers,
budget,
notes
};

try{

const response = await fetch(BACKEND_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(data)
});

if(response.ok){

setOverallMessage("Inquiry submitted successfully!", "success");
form.reset();
clearFieldErrors();

}else{
let errorText = "Server error. Please try again.";
try{
const body = await response.json();
if(body && typeof body.error === "string" && body.error.trim()){
errorText = body.error;
}
}catch(parseError){
}
setOverallMessage(errorText, "error");

}

}catch(error){

setOverallMessage("Network error. Could not submit form.", "error");

}

});
