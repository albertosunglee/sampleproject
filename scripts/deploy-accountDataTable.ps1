# Deploy Account Data Table Components
# This PowerShell script deploys only the Account Data Table LWC and Apex Controller

Write-Host "🚀 Deploying Account Data Table Components..." -ForegroundColor Cyan

try {
    # Deploy to default org
    sfdx force:source:deploy --manifest manifest/accountDataTable-package.xml --wait 10
    
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Deployed Components:" -ForegroundColor Yellow
    Write-Host "  ✓ AccountDataTableController (Apex Class)" -ForegroundColor Green
    Write-Host "  ✓ accountDataTable (Lightning Web Component)" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to Lightning App Builder" -ForegroundColor White
    Write-Host "  2. Edit a Home Page or App Page" -ForegroundColor White
    Write-Host "  3. Drag 'Account Data Table' component onto the page" -ForegroundColor White
    Write-Host "  4. Save and activate the page" -ForegroundColor White
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
