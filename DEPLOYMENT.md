# Account Data Table - Deployment Guide

This guide explains how to deploy the Account Data Table Lightning Web Component to your Salesforce org.

## 📦 Components Included

The deployment package includes:

### Apex Components
- **AccountDataTableController.cls** - Apex controller for fetching Account data
- **AccountDataTableController.cls-meta.xml** - Metadata for the Apex class

### Lightning Web Component
- **accountDataTable.html** - Component template with datatable and pagination
- **accountDataTable.js** - JavaScript controller with search, sort, and pagination logic
- **accountDataTable.js-meta.xml** - Component metadata (makes it available on Home/App pages)
- **accountDataTable.css** - Component styling

## 🚀 Deployment Options

### Option 1: Using the Custom Package.xml (Recommended)
Deploy only the Account Data Table components:

```bash
# Using Salesforce CLI
sfdx force:source:deploy --manifest manifest/accountDataTable-package.xml --wait 10

# Or using the provided scripts:

# Linux/Mac
./scripts/deploy-accountDataTable.sh

# Windows (Command Prompt)
scripts\deploy-accountDataTable.bat

# Windows (PowerShell)
.\scripts\deploy-accountDataTable.ps1
```

### Option 2: Using the Main Package.xml
Deploy all components in the project:

```bash
sfdx force:source:deploy --manifest manifest/package.xml --wait 10
```

### Option 3: Deploy Specific Source
Deploy using source paths:

```bash
# Deploy Apex Controller
sfdx force:source:deploy --sourcepath force-app/main/default/classes/AccountDataTableController.cls

# Deploy LWC Component
sfdx force:source:deploy --sourcepath force-app/main/default/lwc/accountDataTable
```

## 📋 Deployment Package Contents

The `manifest/accountDataTable-package.xml` includes:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>AccountDataTableController</members>
        <name>ApexClass</name>
    </types>
    <types>
        <members>accountDataTable</members>
        <name>LightningComponentBundle</name>
    </types>
    <version>60.0</version>
</Package>
```

## ✅ Post-Deployment Steps

After successful deployment:

1. **Go to Lightning App Builder**
   - Navigate to Setup → Lightning App Builder

2. **Edit a Page**
   - Choose a Home Page or App Page to edit
   - Or create a new App Page

3. **Add the Component**
   - In the component palette, find "Account Data Table"
   - Drag it onto your page layout

4. **Configure (Optional)**
   - Set the component title if desired
   - Adjust the component width/height

5. **Save and Activate**
   - Save your changes
   - Activate the page for your users

## 🔧 Verification

To verify the deployment was successful:

1. **Check Apex Class**
   ```bash
   sfdx force:apex:class:list | grep AccountDataTableController
   ```

2. **Check Lightning Component**
   ```bash
   sfdx force:lightning:component:list | grep accountDataTable
   ```

3. **Test in Org**
   - Go to Lightning App Builder
   - Look for "Account Data Table" in the component palette

## 🛠️ Features Deployed

The deployed component includes:

✅ **Search Functionality** - Client-side search across all account fields  
✅ **Sorting** - All columns sortable with proper data type handling  
✅ **Pagination** - Client-side pagination with customizable page sizes  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Error Handling** - Proper loading states and error messages  
✅ **Debug Logging** - Comprehensive console logging for troubleshooting  

## 🎯 Component Usage

Once deployed, the component can be used on:
- **Home Pages** - Lightning Experience home pages
- **App Pages** - Custom Lightning app pages  
- **Record Pages** - Account record pages (optional)
- **Tabs** - Lightning tabs

## 🔍 Troubleshooting

If deployment fails:

1. **Check SFDX CLI Version**
   ```bash
   sfdx version
   ```

2. **Verify Org Connection**
   ```bash
   sfdx force:org:list
   ```

3. **Check for Conflicts**
   - Ensure no existing components with the same names
   - Check org permissions and limits

4. **Review Error Messages**
   - Look for specific error details in the deployment output
   - Check the debug logs if needed

## 📚 Additional Resources

- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Lightning App Builder](https://help.salesforce.com/articleView?id=lightning_app_builder.htm)
