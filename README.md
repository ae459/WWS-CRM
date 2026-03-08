# WWS-CRM

WorldWide Solutions Corp. CRM Project. Capstone S2026

## Apply schema to Railway MySQL

1. In Railway, open your MySQL service and copy these variables:
   - `mysql-production-70d5.up.railway.app`
   - `3306`
   - `root`
   - `ODuTDNumEIEBbuqlthAruiVzeKqrsOrD`
   - `railway`
2. In your terminal, set those environment variables.
3. Run `./apply_railway_schema.sh` from the project root.

The script applies [setup_database.sql](setup_database.sql) to your Railway database (with SSL required).
