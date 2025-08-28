@echo off

REM Deploy Account Data Table Components
REM This script deploys only the Account Data Table LWC and Apex Controller

echo 🚀 Deploying Account Data Table Components...

REM Deploy to default org
sfdx force:source:deploy --manifest manifest/accountDataTable-package.xml --wait 10

echo ✅ Deployment completed!
echo.
echo 📋 Deployed Components:
echo   ✓ AccountDataTableController (Apex Class)
echo   ✓ accountDataTable (Lightning Web Component)
echo.
echo 📖 Next Steps:
echo   1. Go to Lightning App Builder
echo   2. Edit a Home Page or App Page
echo   3. Drag 'Account Data Table' component onto the page
echo   4. Save and activate the page

pause
