# UAT Delta Deployment Setup Guide

This guide explains how to set up the GitHub Actions workflow for automated delta deployment to your UAT Salesforce org.

## 🚀 Features

The UAT deployment pipeline includes:

✅ **Delta Detection**: Only deploys changed metadata files  
✅ **Package.xml Generation**: Automatically creates deployment package  
✅ **Scratch Org Validation**: Tests changes before deployment  
✅ **Code Quality Checks**: Runs ESLint on changed files  
✅ **Apex Testing**: Runs relevant tests for validation  
✅ **Artifact Storage**: Saves deployment packages for reference  

## 🔧 Required Setup

### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

#### DevHub Authentication (Required for scratch orgs)
- **Secret Name**: `SFDX_AUTH_URL`
- **Value**: Your DevHub SFDX Auth URL

#### UAT Org Authentication
- **Secret Name**: `SFDX_UAT_AUTH_URL`  
- **Value**: Your UAT org SFDX Auth URL

### 2. How to Get SFDX Auth URLs

#### For DevHub:
```bash
# Login to your DevHub
sf org login web --set-default-dev-hub --alias devhub

# Get the auth URL
sf org display --verbose --target-org devhub
# Copy the "Sfdx Auth Url" value
```

#### For UAT Org:
```bash
# Login to your UAT org
sf org login web --alias uat-org

# Get the auth URL
sf org display --verbose --target-org uat-org
# Copy the "Sfdx Auth Url" value
```

### 3. Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names above

## 📋 Workflow Triggers

The workflow runs automatically when:
- ✅ Code is pushed to the `UAT` branch
- ✅ Manual trigger via GitHub Actions UI

## 🔄 How Delta Detection Works

1. **Git Comparison**: Compares current commit with previous commit (or main branch if first push)
2. **File Filtering**: Only includes Salesforce metadata files (.cls, .trigger, .lwc, etc.)
3. **Package Creation**: Copies changed files to delta package
4. **Manifest Generation**: Creates package.xml using Salesforce CLI

## 🧪 Validation Process

Before deploying to UAT, the workflow:

1. **Creates Scratch Org**: Temporary org for testing
2. **Deploys Delta**: Tests the deployment package
3. **Runs Tests**: Executes Apex tests to catch errors
4. **Validates Package**: Ensures no deployment errors

## 📦 Deployment Steps

If validation passes:

1. **Deploy to UAT**: Applies changes to your UAT org
2. **Run Tests**: Quick validation in UAT environment
3. **Create Artifacts**: Saves deployment package for reference

## 🛠️ Manual Workflow Trigger

You can also trigger the deployment manually:

1. Go to **Actions** tab in your GitHub repository
2. Select **UAT Delta Deployment** workflow
3. Click **Run workflow**
4. Select the `UAT` branch
5. Click **Run workflow**

## 📊 Monitoring Deployments

### Workflow Logs
- Check the **Actions** tab for detailed logs
- Each step shows progress and any errors

### Deployment Artifacts
- Delta packages are saved as artifacts
- Download from the workflow run page
- Retained for 30 days

### Success Indicators
✅ All workflow steps complete with green checkmarks  
✅ "Deployment Summary" shows success message  
✅ No errors in UAT org post-deployment  

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Failures
```
Error: Cannot read property 'access_token' of undefined
```
**Solution**: Verify SFDX Auth URLs are correct and haven't expired

#### 2. No Changes Detected
```
No Salesforce metadata files changed. Deployment skipped.
```
**Solution**: Ensure you're modifying files in the `force-app` directory

#### 3. Package.xml Generation Fails
```
No source files found in specified directory
```
**Solution**: Check that changed files are valid Salesforce metadata

#### 4. Scratch Org Creation Fails
```
Error creating scratch org
```
**Solution**: Verify DevHub is properly authenticated and has available scratch orgs

### Debug Steps

1. **Check Secrets**: Ensure all required secrets are properly set
2. **Verify Branch**: Confirm you're pushing to the `UAT` branch
3. **Review Logs**: Check workflow logs for specific error messages
4. **Test Locally**: Try deploying the same changes using SF CLI locally

## 🔗 Related Files

- **Workflow**: `.github/workflows/uat-deployment.yml`
- **Project Config**: `sfdx-project.json`
- **Scratch Org Definition**: `config/project-scratch-def.json`

## 📞 Support

If you encounter issues:

1. Check the workflow logs in GitHub Actions
2. Verify all secrets are correctly configured
3. Ensure your UAT org and DevHub are accessible
4. Test authentication locally using Salesforce CLI

---

## 🎯 Next Steps

1. Configure the required GitHub secrets
2. Push a small change to the `UAT` branch to test
3. Monitor the workflow execution
4. Verify deployment in your UAT org

Happy deploying! 🚀
