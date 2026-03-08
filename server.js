const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.static(path.join(__dirname, "docs")));

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

const mysql = require('mysql2/promise');

const dbHost = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306);
const dbUser = process.env.MYSQLUSER || process.env.DB_USER || 'root';
const dbPassword = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'worldwide_crm';

const shouldUseSsl =
  process.env.DB_SSL === 'true' ||
  dbHost.includes('railway.app') ||
  dbHost.includes('proxy.rlwy.net');

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined
});

async function persist(payload) {
  const [result] = await pool.execute(
    `INSERT INTO travel_deals (name, email, phone, destination, travelStartDate, travelEndDate, numberOfTravelers, budget, notes, stage) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [payload.name, payload.email, payload.phone, payload.destination, 
     payload.travelStartDate, payload.travelEndDate, payload.numberOfTravelers, 
     payload.budget, payload.notes, 'Inquiry Received']
  );
  return result.insertId;
}

app.post("/api/travel-inquiry", async (req, res) => {
  const result = validate(req.body);

  if (!result.valid) {
    return res.status(400).json({ error: result.errors[0] });
  }

  const payload = {
    receivedAt: new Date().toISOString(),
    ...req.body
  };

  try {
    const insertId = await persist(payload);
    res.json({ ok: true, id: insertId });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/travel-inquiry", (req, res) => {
  return res.json({ count: store.length, items: store });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${PORT}`);
});