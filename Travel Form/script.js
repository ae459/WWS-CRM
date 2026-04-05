const form = document.getElementById("travelForm");
const message = document.getElementById("message");

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
if(type === "success"){
message.style.color = "green";
}else if(type === "error"){
message.style.color = "red";
}else{
message.style.color = "";
}
}

form.addEventListener("submit", function(e){

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
setOverallMessage("Travel Inquiry Failed Submission", "error");
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

console.log("Travel inquiry submitted locally:", data);
setOverallMessage("Travel Inquiry Submitted Successfully", "success");
form.reset();
clearFieldErrors();

});
