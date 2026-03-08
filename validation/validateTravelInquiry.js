function validateTravelInquiry(payload) {
  const errors = [];

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

  const isEmail = (email) =>
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidDateString = (value) => {
    if (typeof value !== "string") return false;
    const d = new Date(value);
    return !Number.isNaN(d.getTime());
  };

  Object.keys(payload || {}).forEach((field) => {
    if (!allowedFields.includes(field)) {
      errors.push(`unexpected field: ${field}`);
    }
  });

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
      payload[field] === undefined ||
      payload[field] === null ||
      (typeof payload[field] === "string" && !payload[field].trim())
    ) {
      errors.push(`${field} is required`);
    }
  });

  if (payload.name !== undefined && typeof payload.name !== "string") {
    errors.push("name must be a string");
  }

  if (payload.email !== undefined && !isEmail(payload.email)) {
    errors.push("email must be valid");
  }

  if (payload.phone !== undefined && typeof payload.phone !== "string") {
    errors.push("phone must be a string");
  }

  if (payload.destination !== undefined && typeof payload.destination !== "string") {
    errors.push("destination must be a string");
  }

  if (payload.travelStartDate !== undefined && !isValidDateString(payload.travelStartDate)) {
    errors.push("travelStartDate must be a valid date");
  }

  if (payload.travelEndDate !== undefined && !isValidDateString(payload.travelEndDate)) {
    errors.push("travelEndDate must be a valid date");
  }

  if (
    payload.travelStartDate &&
    payload.travelEndDate &&
    isValidDateString(payload.travelStartDate) &&
    isValidDateString(payload.travelEndDate)
  ) {
    const start = new Date(payload.travelStartDate);
    const end = new Date(payload.travelEndDate);

    if (end <= start) {
      errors.push("travelEndDate must be after travelStartDate");
    }
  }

  if (payload.numberOfTravelers !== undefined) {
    if (!Number.isInteger(payload.numberOfTravelers)) {
      errors.push("numberOfTravelers must be an integer");
    } else if (payload.numberOfTravelers < 1 || payload.numberOfTravelers > 20) {
      errors.push("numberOfTravelers must be between 1 and 20");
    }
  }

  if (payload.budget !== undefined) {
    if (typeof payload.budget !== "number" || Number.isNaN(payload.budget)) {
      errors.push("budget must be a number");
    } else if (payload.budget < 0) {
      errors.push("budget cannot be negative");
    }
  }

  if (payload.notes !== undefined && typeof payload.notes !== "string") {
    errors.push("notes must be a string");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = validateTravelInquiry;

