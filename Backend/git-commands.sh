# Create and switch to new feature branch
git checkout -b feature/vercel-backend/001

# Stage all backend files
git add .

# Commit changes
git commit -m "feat: Initial backend setup with Vercel configuration
- Add server.js with Express configuration
- Add MongoDB connection setup
- Configure Vercel deployment
- Setup environment variables
- Add authentication middleware"

# Push to remote repository
git push origin feature/vercel-backend/001
