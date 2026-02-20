## Supabase setup

- Create a local `.env` file (this repo includes a local `.env` created for convenience but it is ignored by `.gitignore`).
- Required environment variables:
	- `SUPABASE_URL`
	- `SUPABASE_PUBLISHABLE_KEY`
	- `SUPABASE_PROJECT_ID`
	- `SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY`
	- `SUPABASE_SECRET_KEY`

Important: do NOT commit your `.env` file or any secret keys. If these keys were shared publicly, rotate them from the Supabase dashboard immediately.
# Digital-Academic-Records-System