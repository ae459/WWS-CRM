const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const store = [];
const STORE_PATH = path.join(__dirname, "requests.json");

const allowedFields = [
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

function isEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDateString(value) {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function validate(body) {
  const errors = [];

  // Reject extra fields (Task 3: additionalProperties = false)
  const incomingFields = Object.keys(body);
  for (const field of incomingFields) {
    if (!allowedFields.includes(field)) {
      errors.push(`unexpected field: ${field}`);
    }
  }

  const required = [
    "name",
    "email",
    "destination",
    "travelStartDate",
    "travelEndDate",
    "numberOfTravelers"
  ];

  required.forEach((field) => {
    if (
      body[field] === undefined ||
      body[field] === null ||
      (typeof body[field] === "string" && !body[field].trim())
    ) {
      errors.push(`${field} is required`);
    }
  });

  if (body.name !== undefined && typeof body.name !== "string") {
    errors.push("name must be a string");
  }

  if (body.email !== undefined && !isEmail(body.email)) {
    errors.push("email must be valid");
  }

  if (body.phone !== undefined && typeof body.phone !== "string") {
    errors.push("phone must be a string");
  }

  if (body.destination !== undefined && typeof body.destination !== "string") {
    errors.push("destination must be a string");
  }

  if (body.travelStartDate !== undefined && !isValidDateString(body.travelStartDate)) {
    errors.push("travelStartDate must be a valid date");
  }

  if (body.travelEndDate !== undefined && !isValidDateString(body.travelEndDate)) {
    errors.push("travelEndDate must be a valid date");
  }

  if (
    body.travelStartDate &&
    body.travelEndDate &&
    isValidDateString(body.travelStartDate) &&
    isValidDateString(body.travelEndDate)
  ) {
    const start = new Date(body.travelStartDate);
    const end = new Date(body.travelEndDate);

    if (end <= start) {
      errors.push("travelEndDate must be after travelStartDate");
    }
  }

  if (body.numberOfTravelers !== undefined) {
    if (!Number.isInteger(body.numberOfTravelers)) {
      errors.push("numberOfTravelers must be an integer");
    } else if (body.numberOfTravelers < 1 || body.numberOfTravelers > 20) {
      errors.push("numberOfTravelers must be between 1 and 20");
    }
  }

  if (body.budget !== undefined) {
    if (typeof body.budget !== "number" || Number.isNaN(body.budget)) {
      errors.push("budget must be a number");
    } else if (body.budget < 0) {
      errors.push("budget cannot be negative");
    }
  }

  if (body.notes !== undefined && typeof body.notes !== "string") {
    errors.push("notes must be a string");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function persist(payload) {
  store.push(payload);

  let current = [];
  try {
    if (fs.existsSync(STORE_PATH)) {
      current = JSON.parse(fs.readFileSync(STORE_PATH, "utf8") || "[]");
    }
  } catch {
    current = [];
  }

  current.push(payload);
  fs.writeFileSync(STORE_PATH, JSON.stringify(current, null, 2), "utf8");
}

app.post("/api/travel-inquiry", (req, res) => {
  const result = validate(req.body);

  if (!result.valid) {
    return res.status(400).json({ error: result.errors[0] });
  }

  const payload = {
    id: Math.random().toString(16).slice(2) + Date.now().toString(16),
    receivedAt: new Date().toISOString(),
    ...req.body
  };

  console.log("Travel inquiry received:", payload);
  persist(payload);

  return res.status(200).json({ ok: true, id: payload.id });
});

app.get("/api/travel-inquiry", (req, res) => {
  return res.json({ count: store.length, items: store });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});