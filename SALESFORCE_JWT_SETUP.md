# Salesforce JWT Bearer Flow Setup Guide

This guide shows how to set up secure, certificate-based authentication for your CI/CD pipelines using JWT Bearer Flow.

## 🎯 Why JWT Bearer Flow?

✅ **No Expiration**: Certificates don't expire like auth URLs  
✅ **More Secure**: Private key-based authentication  
✅ **Automated**: No manual token refresh required  
✅ **Enterprise Standard**: Salesforce's recommended approach  
✅ **Service Account**: Independent of user sessions

## 📋 Prerequisites

- Admin access to your Salesforce orgs (DevHub, UAT, Production)
- OpenSSL installed (or use online certificate generators)

## 🔧 Step 1: Generate SSL Certificate

### Option A: Using OpenSSL (Local)

```bash
# Generate private key
openssl genrsa -out server.key 2048
# Generate certificate signing request
openssl req -new -key server.key -out server.csr

# Generate self-signed certificate (valid for 2 years)
openssl x509 -req -days 730 -in server.csr -signkey server.key -out server.crt
```

### Option B: Using PowerShell (Windows)

```powershell
# Generate certificate using PowerShell
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256

# Export certificate
Export-Certificate -Cert $cert -FilePath "server.crt"
Export-PfxCertificate -Cert $cert -FilePath "server.pfx" -Password (ConvertTo-SecureString -String "password" -Force -AsPlainText)
```

## 🏢 Step 2: Create Connected App in Salesforce

### For Each Org (DevHub, UAT, Production):

1. **Setup → App Manager → New Connected App**

2. **Basic Information:**
   - Connected App Name: `GitHub Actions CI/CD`
   - API Name: `GitHub_Actions_CICD`
   - Contact Email: Your email

3. **API (Enable OAuth Settings):**
   - ✅ Enable OAuth Settings
   - Callback URL: `http://localhost:1717/OauthRedirect`
   - ✅ Use digital signatures
   - Upload your `server.crt` file

4. **Selected OAuth Scopes:**
   - `Access the identity URL service (id, profile, email, address, phone)`
   - `Access and manage your data (api)`
   - `Access your basic information (id, profile, email, address, phone)`
   - `Perform requests on your behalf at any time (refresh_token, offline_access)`

5. **Save** and wait 2-10 minutes for propagation

6. **Manage Connected App:**
   - Edit Policies
   - Permitted Users: `Admin approved users are pre-authorized`
   - IP Relaxation: `Relax IP restrictions`
   - Save

7. **Manage Profiles/Permission Sets:**
   - Add your integration user or assign to System Administrator profile

## 🔑 Step 3: Get Client ID and Prepare Private Key

### Get Consumer Key (Client ID):

1. Go to your Connected App
2. Copy the **Consumer Key** (this is your Client ID)

### Prepare Private Key:

```bash
# Convert private key to single line for GitHub Secrets
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' server.key
```

## 🎯 Step 4: Update GitHub Secrets

Replace your current secrets with these new ones:

### Required Secrets:

#### DevHub Authentication:

- **`SF_DEVHUB_CLIENT_ID`**: Consumer Key from DevHub Connected App
- **`SF_DEVHUB_PRIVATE_KEY`**: Private key content (single line with \\n)
- **`SF_DEVHUB_USERNAME`**: Your DevHub username

#### UAT Org Authentication:

- **`SF_UAT_CLIENT_ID`**: Consumer Key from UAT Connected App
- **`SF_UAT_PRIVATE_KEY`**: Private key content (single line with \\n)
- **`SF_UAT_USERNAME`**: Your UAT org username

#### Production Org Authentication:

- **`SF_PROD_CLIENT_ID`**: Consumer Key from Production Connected App
- **`SF_PROD_PRIVATE_KEY`**: Private key content (single line with \\n)
- **`SF_PROD_USERNAME`**: Your Production org username

## 🔄 Step 5: Update Workflow Authentication

Replace the authentication steps in your workflows with JWT Bearer Flow:

### Old Method (SFDX Auth URL):

```yaml
- name: Authenticate to DevHub
  run: |
    echo "${{ secrets.SFDX_AUTH_URL }}" > ./SFDX_AUTH_URL.txt
    sf org login sfdx-url --sfdx-url-file ./SFDX_AUTH_URL.txt --alias devhub
```

### New Method (JWT Bearer):

```yaml
- name: Authenticate to DevHub
  run: |
    echo "${{ secrets.SF_DEVHUB_PRIVATE_KEY }}" | base64 -d > devhub_private_key.pem
    sf org login jwt --client-id ${{ secrets.SF_DEVHUB_CLIENT_ID }} --jwt-key-file devhub_private_key.pem --username ${{ secrets.SF_DEVHUB_USERNAME }} --alias devhub --set-default-dev-hub
    rm devhub_private_key.pem
```

## 🔍 Testing the Setup

Test your JWT authentication locally:

```bash
# Test DevHub connection
sf org login jwt --client-id YOUR_CLIENT_ID --jwt-key-file server.key --username YOUR_USERNAME --alias test-devhub

# Verify connection
sf org list --target-dev-hub test-devhub
```

## 🛡️ Security Best Practices

1. **Private Key Security:**
   - Never commit private keys to version control
   - Store only in GitHub Secrets
   - Use different certificates for different environments

2. **Connected App Security:**
   - Limit to specific IP ranges if possible
   - Use admin-approved users only
   - Regular audit of connected apps

3. **Certificate Management:**
   - Set calendar reminders for certificate renewal (yearly)
   - Keep certificates in secure storage
   - Have backup certificates ready

## 🚨 Troubleshooting

### Common Issues:

#### 1. "JWT Validation Failed"

```
Error authenticating to org: JWT Validation failed
```

**Solutions:**

- Check certificate is uploaded correctly to Connected App
- Verify private key format in GitHub Secrets
- Ensure Connected App has propagated (wait 10 minutes)

#### 2. "Invalid Client ID"

```
Error: invalid_client_id
```

**Solutions:**

- Verify Consumer Key is correct
- Check Connected App is active
- Ensure OAuth settings are enabled

#### 3. "User hasn't approved this app"

```
Error: user hasn't approved this app for login
```

**Solutions:**

- Add user to Connected App profiles
- Set "Admin approved users are pre-authorized"
- Assign proper permission sets

### Debug Commands:

```bash
# Test JWT flow locally
sf org login jwt --client-id CLIENT_ID --jwt-key-file private.key --username USERNAME --alias test

# Check org info
sf org display --target-org test

# List connected orgs
sf org list
```

## 📞 Support

If you encounter issues:

1. Test authentication locally first
2. Check Connected App configuration
3. Verify private key format
4. Review Salesforce setup logs

---

**Next Step**: Update your GitHub Actions workflows to use JWT Bearer Flow instead of SFDX Auth URLs.
