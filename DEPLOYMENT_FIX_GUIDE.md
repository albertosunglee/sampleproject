# Deployment from Specific Commit Guide

## Quick Fix Options

### Option 1: Use Workflow Dispatch (Recommended)

1. Go to GitHub Actions → "UAT Delta Deployment"
2. Click "Run workflow"
3. Select UAT branch
4. Run - this will deploy all changes from your latest commit

### Option 2: Temporary Workflow Modification

If you need to deploy from a specific commit range, follow these steps:

#### Step 1: Find Your Commit Hashes

```bash
git log --oneline -5
```

Example output:

```
abc1234 Fix metadata parsing errors (GOOD COMMIT)
def5678 Add Project object and fields (FAILED COMMIT)
ghi9012 Previous working commit (BASELINE)
```

#### Step 2: Temporarily Modify Workflow

In `.github/workflows/uat-deployment-jwt.yml`, replace the "Compute FROM ref" step:

```yaml
- name: Compute FROM ref
  id: base
  shell: bash
  run: |
    # Temporarily override to deploy from specific commit
    FROM_REF="ghi9012"  # Replace with your baseline commit
    echo "from_ref=$FROM_REF" >> "$GITHUB_OUTPUT"
    echo "Comparing FROM: $FROM_REF  TO: HEAD"
```

#### Step 3: Commit and Push

```bash
git add .github/workflows/uat-deployment-jwt.yml
git commit -m "temp: override FROM ref for deployment"
git push origin UAT
```

#### Step 4: Restore Original Workflow

After successful deployment, restore the original workflow:

```yaml
- name: Compute FROM ref
  id: base
  shell: bash
  run: |
    if [ "${{ github.event.before }}" != "0000000000000000000000000000000000000000" ]; then
      FROM_REF="${{ github.event.before }}"
    else
      git fetch origin UAT:origin/UAT || true
      FROM_REF="origin/UAT"
    fi
    echo "from_ref=$FROM_REF" >> "$GITHUB_OUTPUT"
    echo "Comparing FROM: $FROM_REF  TO: HEAD"
```

### Option 3: Force Push (Use with Caution)

If you want to reset the commit history:

```bash
# Reset to your working commit (removes failed commit from history)
git reset --hard abc1234  # Your good commit hash
git push --force origin UAT
```

⚠️ **Warning**: This removes the failed commit from history permanently.

## Delta Behavior Explanation

### How SGD Calculates Delta:

- **FROM**: Previous commit (before your current push)
- **TO**: HEAD (your current commit)
- **Result**: All changes between these two points

### Your Current Situation:

```
ghi9012 (baseline) → def5678 (failed) → abc1234 (fixed)
                                        ↑
                              Current delta includes ALL changes
```

This means your current deployment will include everything from the baseline to your fix, which should work perfectly!

## Recommended Approach

**Just let it run normally!** Your second commit should deploy successfully because:

✅ It includes all the Project object metadata  
✅ It includes all the fixes for the parsing errors  
✅ The delta will be comprehensive and correct  
✅ Your drift detection will catch any conflicts

## Monitoring Your Deployment

Watch for these success indicators:

1. **Delta Generation**: Should show your Project object files
2. **Drift Detection**: Should pass (no conflicts expected)
3. **Deployment**: Should succeed with clean metadata
4. **Testing**: Apex tests should run successfully

## If Deployment Still Fails

1. Check the drift-check artifact for any conflicts
2. Review the deployment logs for specific errors
3. Consider the temporary workflow modification approach
4. Use manual workflow dispatch to retry

Your metadata is now clean and should deploy without issues!
