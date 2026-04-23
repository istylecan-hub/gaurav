# ChatGPT Image Batch Web App (No Install Needed)

This is a zero-dependency web app that lets you:

- Upload multiple reference images (up to 16)
- Add a text prompt
- Generate multiple images in one request (up to 10)
- Download each generated result

## Why this version

Your environment blocks `npm install` with `403 Forbidden`, so this app was changed to avoid external packages.
It now uses:

- A tiny built-in Node static server (`server.js`)
- Browser-side calls directly to OpenAI Images Edit API

## Run

```bash
npm start
```

Open: `http://localhost:3000`

## Usage

1. Paste your OpenAI API key into the form.
2. Enter a prompt.
3. Upload one or more reference images.
4. Choose output count and image settings.
5. Click **Generate**.

## Security note

This version sends your API key from the browser directly to OpenAI. Use locally only.
For production, move API calls to a backend service and keep API keys server-side.
