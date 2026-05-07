# SchoolMart

React single page shopping app for school supplies.

## Project Structure

- `client/` - React/Vite frontend
- `server/` - Express API and Supabase data access

## Run Locally

```bash
npm install
cd client && npm install
cd ..
npm run dev
```

The React app runs through Vite, and API requests proxy to the Express server.

## Product Images

Product images come from Supabase product rows. Store each Cloudinary URL in the `products.image_url` column.

The React product card reads that URL directly:

```jsx
product.image_url
```
