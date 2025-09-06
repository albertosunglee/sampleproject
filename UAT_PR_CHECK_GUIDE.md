# UAT PR Check - Dry Run Validation Guide

This guide explains the new automated PR validation pipeline for the UAT environment.

## 🎯 Purpose

The UAT PR Check workflow provides **automated validation** for pull requests targeting the UAT branch. It performs a **dry run deployment** to validate changes without actually deploying anything to the UAT environment.

## ✨ Features

✅ **Automatic PR Validation**: Runs on every PR targeting UAT  
✅ **Dry Run Only**: Validates deployment without making changes  
✅ **Delta Detection**: Only validates changed metadata files  
✅ **Drift Analysis**: Checks if UAT org differs from PR changes  
✅ **Code Quality**: Runs ESLint and Prettier checks  
✅ **PR Comments**: Posts validation results directly on PR  
✅ **Check Status**: Sets GitHub check status for branch protection

## 🔧 How It Works

### Automatic Triggers

The workflow automatically runs when:

- ✅ A pull request is **opened** targeting the `UAT` branch
- ✅ New commits are **pushed** to an existing PR
- ✅ A PR is **reopened**

### Manual Triggers

You can also run validation manually:

1. Go to **Actions** → **UAT PR Check - Dry Run Validation**
2. Click **Run workflow**
3. Enter the PR number to validate
4. Click **Run workflow**

## 🔍 Validation Steps

1. **Delta Generation**: Compares PR changes with UAT branch
2. **Drift Detection**: Checks if UAT org matches PR metadata
3. **Dry Run Validation**: Tests deployment without applying changes
4. **Code Quality**: Runs linting and formatting checks
5. **Destructive Changes**: Validates any deletions (dry run)
6. **PR Comment**: Posts detailed results on the PR

## 📝 PR Comments

The workflow automatically comments on PRs with:

### ✅ Success Example

```
## ✅ UAT PR Validation Results

**Overall Status**: ✅ PASSED
**Validation Type**: Dry Run (No Deployment)

### 📦 Deployment Validation
✅ PR validation successful - All metadata can be deployed safely

### 🔍 Drift Detection
✅ No drift detected - PR metadata aligns with UAT org

### 🧹 Code Quality
✅ Code quality checks passed

### What happens next?
- ✅ Ready to merge: This PR passed all validation checks
- 🚀 Deployment: Changes will be deployed to UAT when merged
```

### ❌ Failure Example

```
## ❌ UAT PR Validation Results

**Overall Status**: ❌ FAILED
**Validation Type**: Dry Run (No Deployment)

### 📦 Deployment Validation
❌ PR validation failed - Deployment issues detected

### What happens next?
- ❌ Fix required: Please resolve the validation issues before merging
- 🔧 Action needed: Check the workflow logs for specific error details
```

## 🛡️ Branch Protection

You can configure branch protection rules for the `UAT` branch to:

- ✅ **Require status checks** (UAT PR Validation must pass)
- ✅ **Block merging** until validation succeeds
- ✅ **Require up-to-date branches** before merging

### Setting up Branch Protection:

1. Go to **Settings** → **Branches**
2. Add rule for `UAT` branch
3. Enable **Require status checks to pass**
4. Select **UAT PR Validation** from the list
5. Save the rule

## 🔄 Integration with Existing Workflows

This new workflow complements your existing setup:

| Workflow                | Purpose                | Trigger        |
| ----------------------- | ---------------------- | -------------- |
| **UAT PR Check**        | Validate PRs (dry run) | PR to UAT      |
| **UAT Deployment**      | Deploy changes         | Push to UAT    |
| **UAT Drift Detection** | Find org changes       | Daily schedule |

## 📊 Monitoring & Artifacts

### Workflow Logs

- Check **Actions** tab for detailed validation logs
- Each step shows progress and any issues found

### Artifacts

- **PR validation artifacts** are saved for 7 days
- Contains delta packages and drift analysis
- Download from workflow run page

### Check Status

- GitHub shows validation status on PR
- Green checkmark = validation passed
- Red X = validation failed

## 🚨 Troubleshooting

### Common Issues

#### Validation Fails But Local Deploy Works

- **Cause**: UAT org may have drift or different state
- **Solution**: Check drift detection results in PR comment

#### Workflow Fails to Run

- **Cause**: Missing secrets or permissions
- **Solution**: Verify JWT secrets are configured correctly

#### No PR Comment Posted

- **Cause**: Missing PR write permissions
- **Solution**: Check workflow permissions in yaml file

### Debug Steps

1. **Check PR Comment**: Look for detailed error messages
2. **Review Workflow Logs**: Click "Details" on failed check
3. **Download Artifacts**: Examine delta and drift files
4. **Test Locally**: Run `sf project deploy start --dry-run` locally

## ⚙️ Required Secrets

The workflow uses the same secrets as your UAT deployment:

- `SF_UAT_PRIVATE_KEY`: JWT private key for UAT authentication
- `SF_UAT_CLIENT_ID`: Connected app client ID
- `SF_UAT_USERNAME`: UAT org username

## 🎉 Benefits

### For Developers

- ✅ **Early feedback** on deployment issues
- ✅ **No surprises** when merging to UAT
- ✅ **Quality assurance** before deployment

### For Team

- ✅ **Automated validation** reduces manual testing
- ✅ **Consistent quality** across all changes
- ✅ **Clear documentation** of what each PR does

### For DevOps

- ✅ **Prevents broken deployments** to UAT
- ✅ **Maintains org stability**
- ✅ **Audit trail** of all validations

---

## 📞 Support

If you encounter issues:

1. Check the PR comment for specific error details
2. Review the workflow logs in GitHub Actions
3. Verify all required secrets are properly configured
4. Test the same changes locally using Salesforce CLI

Happy validating! 🚀
