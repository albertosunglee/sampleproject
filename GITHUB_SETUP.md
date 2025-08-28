# GitHub Repository Setup Guide

This guide will help you set up your Salesforce project on GitHub with automated CI/CD pipeline.

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. SFDX_AUTH_URL (Required)
This is the authentication URL for your Dev Hub org.

**To get this value:**
1. Authenticate to your Dev Hub org locally:
   ```bash
   sf org login web --alias devhub --set-default-dev-hub
   ```

2. Get the auth URL:
   ```bash
   sf org display --target-org devhub --verbose
   ```

3. Copy the "Sfdx Auth Url" value and add it as `SFDX_AUTH_URL` secret in GitHub.

### 2. SFDX_PROD_AUTH_URL (Required for production deployments)
This is the authentication URL for your production org.

**To get this value:**
1. Authenticate to your production org locally:
   ```bash
   sf org login web --alias production
   ```

2. Get the auth URL:
   ```bash
   sf org display --target-org production --verbose
   ```

3. Copy the "Sfdx Auth Url" value and add it as `SFDX_PROD_AUTH_URL` secret in GitHub.

## Repository Setup Steps

### 1. Create GitHub Repository

1. Go to your GitHub organization (DEVORG)
2. Click "New repository"
3. Name your repository (e.g., "salesforce-account-datatable")
4. Choose public or private as needed
5. **Do NOT** initialize with README, .gitignore, or license (we already have these files)
6. Click "Create repository"

### 2. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add both secrets mentioned above:
   - `SFDX_AUTH_URL`
   - `SFDX_PROD_AUTH_URL`

### 3. Set Up Production Environment Protection

1. Go to repository "Settings" → "Environments"
2. Click "New environment" and name it "production"
3. Add protection rules:
   - ✅ Required reviewers (add yourself or team members)
   - ✅ Wait timer (optional, e.g., 5 minutes)
   - ✅ Deployment branches: Selected branches only → `main`

### 4. Initialize Git Repository Locally

```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Salesforce Account DataTable project with CI/CD pipeline"

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/DEVORG/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## GitHub Actions Workflow Overview

The pipeline includes:

### 🔍 Code Quality & Testing
- ESLint code quality checks
- LWC Jest unit tests
- Test coverage reporting

### 🚀 Salesforce Validation
- Creates temporary scratch org
- Deploys source code
- Runs Apex tests
- Validates deployment

### 🎯 Production Deployment (main branch only)
- Validates deployment to production
- Deploys to production org
- Runs production tests
- Requires manual approval (environment protection)

### 📢 Notifications
- Success/failure notifications
- Deployment status updates

## Trigger Conditions

The pipeline runs when:
- **Push to `main` or `develop` branches**
- **Pull requests to `main` branch**

Production deployment only happens on:
- **Push to `main` branch** (requires manual approval)

## Development Workflow

### Feature Development
1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit
3. Push branch: `git push origin feature/your-feature-name`
4. Create Pull Request to `main`
5. Pipeline runs validation (no deployment)
6. Merge after review and successful validation

### Main Branch Deployment
1. Merge PR to `main` or push directly to `main`
2. Pipeline runs full validation
3. If validation passes, deployment to production requires manual approval
4. Click "Review deployments" in GitHub Actions tab
5. Approve deployment to production

## Troubleshooting

### Common Issues

1. **Authentication failures**: Verify SFDX auth URLs are correct and not expired
2. **Test failures**: Ensure all Apex tests pass locally before pushing
3. **Deployment failures**: Check for metadata conflicts or missing dependencies

### Useful Commands

```bash
# Test locally before pushing
npm run lint
npm run test:unit

# Validate deployment locally
sf project deploy start --dry-run

# Run tests locally
sf apex run test --result-format human
```

## Next Steps

1. Set up branch protection rules for `main` branch
2. Consider adding Slack/Teams notifications
3. Set up code coverage requirements
4. Add integration tests if needed
5. Configure automatic dependency updates with Dependabot
