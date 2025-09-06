# Workflow Commit Parameter Guide

## ✅ Already Added to Your Workflow!

Your UAT deployment workflow now includes a **`from_commit`** input parameter that allows you to specify exactly which commit to deploy from.

## 🎯 How to Use the Commit Parameter

### Method 1: Manual Workflow Trigger with Commit

1. **Go to GitHub Actions** → **"UAT Delta Deployment"**
2. **Click "Run workflow"**
3. **Fill in the parameters:**
   - **Deployment scope**: Choose what to deploy
   - **From commit**: Enter the specific commit hash
   - **Other options**: Set as needed

### Method 2: Find Your Commit Hash

Get the commit hash you want to deploy from:

```bash
# Show recent commits with hashes
git log --oneline -10

# Example output:
# abc1234 Fix metadata parsing errors (LATEST)
# def5678 Add Project object and fields
# ghi9012 Previous working commit
# jkl3456 Initial setup
```

## 📋 Workflow Parameters Available

### **from_commit** (Your Request!)

- **Description**: "Deploy from specific commit (optional - leave empty for auto)"
- **Type**: Text input
- **Usage**: Enter the commit hash (e.g., `ghi9012`)
- **Default**: Empty (uses automatic detection)

### **deployment_scope**

- **Description**: "What to deploy"
- **Options**:
  - `full` - Deploy everything
  - `objects_only` - Deploy only custom objects (skip PermissionSets)
  - `permission_sets_only` - Deploy only PermissionSets
  - `custom_selection` - Use other parameters to control

### **force_deployment**

- **Description**: "Force deployment even if drift detected"
- **Type**: Boolean (true/false)
- **Usage**: Override drift detection halts

## 🚀 Example Usage Scenarios

### Scenario 1: Deploy Objects Only from Specific Commit

```
deployment_scope: objects_only
from_commit: ghi9012
include_permission_sets: false
force_deployment: false
```

### Scenario 2: Deploy Everything from Working Commit

```
deployment_scope: full
from_commit: ghi9012
force_deployment: true
```

### Scenario 3: Deploy Only PermissionSets Later

```
deployment_scope: permission_sets_only
from_commit: (leave empty for latest)
force_deployment: false
```

## 🔧 How It Works in the Workflow

The workflow logic checks for your commit parameter:

```yaml
# Check if manual from_commit parameter is provided
if [ -n "${{ inputs.from_commit }}" ]; then
  FROM_REF="${{ inputs.from_commit }}"
  echo "🎯 Using manual FROM commit: $FROM_REF"
elif [ "${{ github.event.before }}" != "0000000000000000000000000000000000000000" ]; then
  FROM_REF="${{ github.event.before }}"
  echo "📝 Using automatic FROM commit: $FROM_REF"
else
  git fetch origin UAT:origin/UAT || true
  FROM_REF="origin/UAT"
  echo "🌿 Using branch reference: $FROM_REF"
fi
```

## 💡 Solving Your PermissionSet Issue

**Recommended approach for your current situation:**

1. **First deployment** - Objects only:

   ```
   deployment_scope: objects_only
   from_commit: ghi9012 (your baseline)
   ```

2. **Second deployment** - PermissionSets only:
   ```
   deployment_scope: permission_sets_only
   from_commit: (leave empty for latest)
   ```

## 📝 Step-by-Step Process

### Step 1: Get Your Commit Hash

```bash
git log --oneline -5
```

### Step 2: Run Workflow Manually

1. GitHub Actions → UAT Delta Deployment
2. Click "Run workflow"
3. Enter your commit hash in "from_commit" field
4. Set other parameters as needed
5. Click "Run workflow"

### Step 3: Monitor Deployment

Watch the logs for:

- `🎯 Using manual FROM commit: your_hash`
- Delta generation from your specific commit
- Successful deployment

## 🎉 Benefits

- ✅ **Precise Control**: Deploy exactly what you want
- ✅ **Skip Failed Commits**: Deploy from last known good state
- ✅ **Incremental Deployment**: Deploy objects first, then PermissionSets
- ✅ **Rollback Capability**: Deploy from any previous commit
- ✅ **Testing**: Test deployments from specific feature commits

Your workflow is now fully parameterized and ready to use!
