# PowerShell script to generate JWT certificates for Salesforce authentication
# Run this script in PowerShell as Administrator

Write-Host "🔐 Generating JWT Certificate for Salesforce Authentication..." -ForegroundColor Green

# Create certificates directory if it doesn't exist
$certDir = "certificates"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir
    Write-Host "✅ Created certificates directory" -ForegroundColor Yellow
}

try {
    # Generate self-signed certificate
    $cert = New-SelfSignedCertificate `
        -DnsName "salesforce-cicd" `
        -CertStoreLocation "cert:\CurrentUser\My" `
        -KeyExportPolicy Exportable `
        -KeySpec Signature `
        -KeyLength 2048 `
        -KeyAlgorithm RSA `
        -HashAlgorithm SHA256 `
        -NotAfter (Get-Date).AddYears(2) `
        -Subject "CN=Salesforce CI/CD"

    Write-Host "✅ Generated certificate with thumbprint: $($cert.Thumbprint)" -ForegroundColor Green

    # Export certificate (public key for Salesforce)
    $certPath = "$certDir\salesforce-cicd.crt"
    Export-Certificate -Cert $cert -FilePath $certPath | Out-Null
    Write-Host "✅ Exported certificate to: $certPath" -ForegroundColor Green

    # Export private key for GitHub Secrets
    $keyPath = "$certDir\salesforce-cicd.key"
    
    # Get private key in PEM format
    $keyBytes = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert).ExportRSAPrivateKey()
    $keyPem = [System.Convert]::ToBase64String($keyBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
    $keyPemFormatted = "-----BEGIN RSA PRIVATE KEY-----`n$keyPem`n-----END RSA PRIVATE KEY-----"
    
    Set-Content -Path $keyPath -Value $keyPemFormatted
    Write-Host "✅ Exported private key to: $keyPath" -ForegroundColor Green

    # Generate single-line version for GitHub Secrets
    $keyOneLine = $keyPemFormatted -replace "`r`n", "\n" -replace "`n", "\n"
    $oneLineKeyPath = "$certDir\salesforce-cicd-oneline.key"
    Set-Content -Path $oneLineKeyPath -Value $keyOneLine
    Write-Host "✅ Generated single-line key for GitHub Secrets: $oneLineKeyPath" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Upload '$certPath' to your Salesforce Connected Apps" -ForegroundColor White
    Write-Host "2. Copy the content of '$oneLineKeyPath' to GitHub Secrets" -ForegroundColor White
    Write-Host "3. Follow the setup guide in SALESFORCE_JWT_SETUP.md" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📋 Files created:" -ForegroundColor Yellow
    Write-Host "   📄 $certPath (upload to Salesforce)" -ForegroundColor White
    Write-Host "   🔑 $keyPath (private key - keep secure)" -ForegroundColor White
    Write-Host "   📝 $oneLineKeyPath (for GitHub Secrets)" -ForegroundColor White

    Write-Host ""
    Write-Host "🔒 Security Note: Keep private key files secure and never commit them to version control!" -ForegroundColor Red

} catch {
    Write-Host "❌ Error generating certificate: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Certificate generation completed successfully!" -ForegroundColor Green
