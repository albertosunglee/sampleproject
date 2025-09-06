# UAT Deployment Delta-Based Drift Detection Guide

## Overview

Your UAT deployment pipeline has been enhanced with **delta-based drift detection** to ensure that only the metadata you're about to deploy is checked for drift. This approach is more efficient and targeted than checking the entire org.

## What Was Added

### 1. Delta-Based Drift Detection Step

- **Location**: After delta generation, before deployment
- **Purpose**: Compares ONLY the metadata being deployed (delta) between UAT org and repository
- **Output**: Creates a `drift-check/` folder with detailed comparison results for delta metadata only

### 2. New Environment Variable

```yaml
HALT_ON_DRIFT: false # Set to true to halt deployment when drift is detected
```

### 3. Delta Drift Check Artifacts

When drift is detected, the workflow creates:

- `drift-check/org-delta-metadata/` - Current state of delta metadata in UAT org
- `drift-check/repo-delta-metadata/` - Current state of delta metadata in repository
- `drift-check/DRIFT_REPORT.md` - Detailed delta drift analysis report
- `drift-check/drift-summary.txt` - Summary of differences found in delta metadata

## How It Works

### Delta-Based Drift Detection Process

1. **Generate Delta**: Creates delta package.xml with changes to be deployed
2. **Extract Delta Metadata**: Copies delta metadata from repository
3. **Retrieve Delta from Org**: Downloads ONLY delta metadata from UAT org using delta package.xml
4. **Compare Delta Only**: Uses `diff` to identify differences between org and repository for delta metadata only
5. **Report**: Generates detailed reports if differences are found in delta metadata
6. **Gate Decision**: Decides whether to continue or halt deployment based on delta drift

### Deployment Behavior

#### When No Delta Drift Detected ✅

- Deployment proceeds normally
- Delta metadata in org matches repository
- No additional artifacts created

#### When Delta Drift Detected ⚠️

- **HALT_ON_DRIFT=false** (default):
  - Logs warning but continues deployment
  - Deployment will overwrite org changes in delta metadata
  - Creates drift-check artifact for review
- **HALT_ON_DRIFT=true**:
  - Stops deployment immediately
  - Forces manual review of delta differences
  - Creates drift-check artifact for analysis

## Configuration Options

### Environment Variables

```yaml
env:
  HALT_ON_DRIFT: false # Change to true to halt on drift
```

### Metadata Types Checked

The delta drift detection dynamically checks only the metadata types that are included in your deployment delta:

- **Dynamic Detection**: Only metadata in the delta package.xml is checked
- **Common Types**: Apex Classes, Components, Pages, Triggers, LWC, Aura Bundles
- **Configuration**: Custom Objects, Fields, Labels, Tabs, Flows, Layouts
- **Security**: Permission Sets, Profiles, etc.
- **Other**: Static Resources, Remote Site Settings, Workflows, etc.

**Key Advantage**: No time wasted checking metadata you're not deploying!

## Using the Drift Detection Results

### Reviewing Delta Drift Artifacts

1. **Download the artifact**: `drift-check-{commit-sha}` from GitHub Actions
2. **Review the report**: Check `DRIFT_REPORT.md` for delta drift summary
3. **Compare delta metadata**:
   - `org-delta-metadata/` = Current org state of delta metadata
   - `repo-delta-metadata/` = Repository state of delta metadata

### Resolution Options

#### Option 1: Accept Org Changes

1. Use your separate drift detection workflow to create a PR
2. Merge the drift into your repository
3. Re-run deployment

#### Option 2: Overwrite Org Changes

1. Set `HALT_ON_DRIFT=false` (if not already)
2. Re-run deployment (will overwrite org changes)

#### Option 3: Investigate & Merge

1. Manually review each difference
2. Selectively merge needed changes
3. Re-run deployment

## Best Practices

### 1. Monitor Drift Regularly

- Keep your existing scheduled drift detection workflow
- Review drift artifacts when deployment detects differences

### 2. Set Appropriate Halt Policy

- **Development/Testing**: `HALT_ON_DRIFT=false` for flexibility
- **Production**: `HALT_ON_DRIFT=true` for strict control

### 3. Team Communication

- Notify team when drift is detected
- Establish process for handling drift resolution
- Document decisions about accepting vs rejecting org changes

## Troubleshooting

### Common Issues

#### Drift Detection Fails

- Check UAT org authentication
- Verify metadata types in package.xml
- Review Salesforce CLI version compatibility

#### False Positives

- Metadata formatting differences
- Timestamp-related changes
- Auto-generated metadata

#### Performance Impact

- **Significantly faster**: Delta-based approach only checks metadata being deployed
- Adds ~30-90 seconds to deployment (vs 2-3 minutes for full org scan)
- Only runs after delta generation, before actual deployment
- Metadata retrieval is targeted and efficient

## Example Workflow Output

```
🔍 Checking for drift in metadata to be deployed (delta-based)...
📦 Analyzing delta package for drift detection...
📥 Retrieving delta metadata from UAT org...
⚠️  DELTA DRIFT DETECTED: UAT org differs from repository for deployment metadata!
📁 Drift details saved to drift-check/ folder
📋 This means the metadata you're about to deploy differs from what's currently in the UAT org.
⚠️  PROCEEDING WITH DEPLOYMENT despite delta drift (HALT_ON_DRIFT=false)
⚠️  WARNING: This deployment will overwrite the detected org changes in the delta metadata!
```

## Benefits of Delta-Based Approach

### ✅ Efficiency

- **Faster**: Only checks metadata being deployed (~30-90 seconds vs 2-3 minutes)
- **Focused**: No time wasted on unrelated metadata
- **Targeted**: Directly relevant to your deployment

### ✅ Accuracy

- **Precise**: Only flags drift that could actually conflict with your deployment
- **Relevant**: Reduces false positives from unrelated org changes
- **Actionable**: Every drift detected is something you need to address

### ✅ Developer Experience

- **Clear**: Easy to understand what metadata conflicts
- **Fast feedback**: Quick detection without long waits
- **Contextual**: Drift reports show exactly what you're about to deploy

## Related Workflows

- **Existing**: `uat-drift-detection.yml` - Scheduled full org drift detection
- **Updated**: `uat-deployment-jwt.yml` - Now includes delta-based pre-deployment drift check

This delta-based integration ensures you're always aware of conflicts in the specific metadata you're deploying!
