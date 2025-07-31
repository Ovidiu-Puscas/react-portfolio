# Firebase Deployment Troubleshooting Guide

This guide helps resolve common Firebase deployment issues, particularly the "Could not find index.html" error.

## Common Error: "Could not find a required file. Name: index.html"

### Root Cause

Firebase is using a different build process (pack) that may not properly include the `public` directory in the build context.

### Solutions

#### Solution 1: Verify File Structure

Ensure your project has the correct structure:

```
react-portfolio/
├── public/
│   ├── index.html          ← This file must exist
│   ├── manifest.json
│   ├── favicon.ico
│   └── logo*.png
├── src/
├── package.json
├── firebase.json           ← Firebase configuration
└── .firebaserc            ← Firebase project config
```

#### Solution 2: Check Firebase Configuration

1. **firebase.json** - Should point to the build directory:

   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "predeploy": ["npm run build"]
     }
   }
   ```

2. **.firebaserc** - Should specify your project:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

#### Solution 3: Manual Build Process

1. **Build locally first:**

   ```bash
   npm run build
   ```

2. **Verify build output:**

   ```bash
   ls -la build/
   # Should show index.html and other files
   ```

3. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

#### Solution 4: Environment Variables

If using environment variables, ensure they're set in Firebase:

1. Go to Firebase Console → Project Settings → Environment Variables
2. Add your environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - etc.

#### Solution 5: Custom Build Script

Use the provided `firebase-build.sh` script:

```bash
chmod +x firebase-build.sh
./firebase-build.sh
```

### Debugging Steps

#### Step 1: Check Local Build

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build locally
npm run build

# Check build output
ls -la build/
cat build/index.html
```

#### Step 2: Check Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Check Firebase project
firebase projects:list
```

#### Step 3: Test Firebase Locally

```bash
# Serve locally
firebase serve

# Or use the npm script
npm run firebase:serve
```

### Alternative Deployment Methods

#### Method 1: Manual Upload

1. Build locally: `npm run build`
2. Upload `build/` directory to Firebase Hosting manually

#### Method 2: GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          projectId: your-project-id
```

#### Method 3: Google Cloud Build

Use the existing `cloudbuild.yaml` configuration.

### Environment-Specific Issues

#### Issue: Build Context Missing Files

**Symptoms:** Files not found during build
**Solution:** Ensure all necessary files are in the repository and not ignored by `.gitignore`

#### Issue: Environment Variables Not Set

**Symptoms:** Build fails with undefined variables
**Solution:** Set environment variables in Firebase Console or use `.env` file locally

#### Issue: Firebase Project Not Configured

**Symptoms:** Deployment fails with project errors
**Solution:** Update `.firebaserc` with correct project ID

### Verification Commands

```bash
# Check if public/index.html exists
ls -la public/index.html

# Check if build/index.html exists after build
npm run build && ls -la build/index.html

# Check Firebase configuration
firebase projects:list
firebase use --add

# Test deployment locally
firebase serve --only hosting
```

### Common Fixes

1. **Missing public/index.html:**

   - Ensure the file exists and is not ignored by `.gitignore`
   - Check file permissions

2. **Build directory not created:**

   - Check for build errors in console
   - Verify all dependencies are installed

3. **Firebase project not found:**

   - Update `.firebaserc` with correct project ID
   - Ensure you have access to the Firebase project

4. **Environment variables missing:**
   - Set variables in Firebase Console
   - Or use `.env` file for local development

### Support Resources

- [Firebase Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [React Build Process](https://create-react-app.dev/docs/production-build)

### Quick Fix Checklist

- [ ] `public/index.html` exists
- [ ] `firebase.json` is configured correctly
- [ ] `.firebaserc` has correct project ID
- [ ] Environment variables are set
- [ ] Local build works (`npm run build`)
- [ ] Firebase CLI is installed and logged in
- [ ] You have access to the Firebase project
