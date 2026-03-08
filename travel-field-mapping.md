## Travel Inquiry Field Mapping

| Request field       | Zoho module.field           |
| ------------------- | --------------------------- |
| `name`              | `Contacts.Full_Name`        |
| `email`             | `Contacts.Email`            |
| `phone`             | `Contacts.Phone`            |
| `destination`       | `Deals.Destination`         |
| `travelStartDate`   | `Deals.Travel_Start_Date`   |
| `travelEndDate`     | `Deals.Travel_End_Date`     |
| `numberOfTravelers` | `Deals.Number_of_Travelers` |
| `budget`            | `Deals.Budget`              |
| `notes`             | `Deals.Description`         |

## Server-Side Validation Rules

- Required fields: `name`, `email`, `destination`, `travelStartDate`, `travelEndDate`, `numberOfTravelers`.
- Email format: must match a valid email pattern.
- Date logic:
  - `travelStartDate` and `travelEndDate` must be valid dates.
  - `travelEndDate` must be after `travelStartDate`.
- Numeric ranges:
  - `numberOfTravelers` must be an integer between 1 and 20.
  - `budget` must be a number and cannot be negative.
- Extra request fields are rejected (`additionalProperties: false`).
