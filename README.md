# Getting Started with ConvoStack

Run the following steps in your terminal to get started!

P.S. You can copy/paste the instructions below directly into your terminal to get the demo up and running in seconds!

```bash
# Clone the getting started repo
git clone https://github.com/ConvoStack/getting-started convostack-getting-started

# Enter the project root directory
cd convostack-getting-started

# Install all dependencies
npm install

# Setup your backend .env using the example provided
# Optionally, edit the apps/backend/.env file to set your OpenAI API key to try the GPT-3.5 or GPT-4 the langchain demo
cd apps/backend
cp .env.example .env

# Run the database migrations on a sqlite DB for development
npm run migrate-sqlite

# Get back into the root of the project
cd ../..

# Start the full-stack demo
npm run dev

# 🚀 See the demo running now on http://localhost:5173/
```
