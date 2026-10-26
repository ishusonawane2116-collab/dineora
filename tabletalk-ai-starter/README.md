# TableTalk AI — beginner setup

This project contains a React website and a small Express backend. The backend keeps the OpenAI API key out of the browser.

## Before you start
- Install Node.js LTS from https://nodejs.org/
- Use a NEW API key. Revoke any key that was shared in a chat or screenshot.
- API usage may cost money. Check your API billing and usage limits in your OpenAI platform account.

## 1. Open the project in VS Code
1. Extract `tabletalk-ai-starter.zip`.
2. Open VS Code.
3. Choose **File → Open Folder**.
4. Select the extracted `tabletalk-ai-starter` folder.

## 2. Install dependencies
1. In VS Code choose **Terminal → New Terminal**.
2. Run:
   ```bash
   npm install
   ```

## 3. Create your private .env file
1. In the VS Code Explorer, make a copy of `.env.example` named `.env` (the name must be exactly `.env`, with no `.txt`).
2. Open `.env`.
3. Replace `replace_with_your_new_key` with your NEW key:
   ```env
   OPENAI_API_KEY=your_new_secret_key_here
   PORT=3001
   ```
4. Save the file.

**Never paste the key into `src/App.jsx`, never put it in a `VITE_...` variable, and never share or upload `.env`.** `.gitignore` excludes it from Git, but still keep it private.

## 4. Start the website and backend
In the VS Code terminal run:
```bash
npm run dev
```
Keep that terminal open. It runs both the frontend and backend.
- Website: http://localhost:5173
- Backend health check: http://localhost:3001/api/health

Open the website URL in your browser. Type a question into the chat and press Send.

## 5. If it does not work
- **`npm` not recognized:** install Node.js LTS, then fully close and reopen VS Code.
- **Port already in use:** stop another development server with Ctrl+C, then run `npm run dev` again.
- **API key rejected / 401:** confirm the `.env` contains the new key and restart the terminal.
- **Quota / 429:** check your OpenAI API usage, billing, and limits.
- **Backend not running:** check the terminal for the message `TableTalk AI backend running at http://localhost:3001`.
- **Website can't connect:** run both parts using `npm run dev` from the project folder.

## Important
This is a local development project. `localhost` works on your computer only. To share the website publicly, deploy the frontend and backend to a hosting service, configure the secret key as a server-side environment variable, and update the frontend API URL to the deployed backend. Do not deploy the `.env` file.

## Included files
- `src/App.jsx`: website and chat interface
- `src/index.css`: design and responsive styling
- `server/index.js`: backend endpoint that calls OpenAI
- `.env.example`: safe template, not a real key
