# Getting Started with ConvoStack

Run the following steps in your terminal to get started!

```bash
# Clone the getting started repo
git clone https://github.com/ConvoStack/getting-started

# Enter the project root directory
cd getting-started

# Install dependencies
npm install

# Setup your .env using the example provided
# Optionally, edit the apps/backend/.env file to set your OpenAI API key to try the GPT-3.5 or GPT-4 the langchain demo
cp apps/backend/.env.example apps/backend/.env

# Run the database migrations on a sqlite DB for development
npm run migrate

# Get back into the root of the project
cd ..

# Start the full-stack demo
npm run dev

# 🚀 See the demo running now on http://localhost:5173/
```
