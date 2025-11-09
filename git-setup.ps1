# Git Setup and Push Instructions
# Modern Web Template - Git Commands

# 1. INITIAL SETUP (Already completed)
# git init
# git add .
# git commit -m "Initial commit: Add modern web template with responsive design and interactive features"
# git branch -M main

# 2. CONNECT TO REMOTE REPOSITORY
# Replace 'yourusername' and 'repository-name' with your actual values

# For GitHub:
# git remote add origin https://github.com/yourusername/repository-name.git

# For GitLab:
# git remote add origin https://gitlab.com/yourusername/repository-name.git

# For Bitbucket:
# git remote add origin https://bitbucket.org/yourusername/repository-name.git

# 3. PUSH TO REMOTE
# git push -u origin main

# 4. FUTURE UPDATES
# After making changes to your files:
# git add .
# git commit -m "Your commit message describing the changes"
# git push

# 5. USEFUL GIT COMMANDS
# git status              # Check current status
# git log                 # View commit history
# git diff                # See changes since last commit
# git branch             # List branches
# git pull               # Pull latest changes from remote
# git clone <url>        # Clone a repository

# 6. CONFIGURE GIT USER (if not already done)
# git config --global user.name "Your Name"
# git config --global user.email "your.email@example.com"

# 7. GENERATE SSH KEY (optional, for secure authentication)
# ssh-keygen -t ed25519 -C "your.email@example.com"
# Then add the public key to your Git hosting service

echo "Git repository initialized successfully!"
echo "Next steps:"
echo "1. Create a repository on GitHub/GitLab/Bitbucket"
echo "2. Copy the repository URL"
echo "3. Run: git remote add origin <your-repository-url>"
echo "4. Run: git push -u origin main"
