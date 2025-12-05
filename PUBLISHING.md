# Publishing to VS Code Marketplace

This guide will help you automatically publish your extension to the VS Code Marketplace using GitHub Actions.

## 📋 Prerequisites

1. A GitHub account with this repository
2. A Microsoft/Azure account
3. A publisher ID on the VS Code Marketplace

---

## 🚀 Setup Instructions

### Step 1: Create a Publisher ID

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Click **"Create publisher"**
4. Choose a unique publisher ID (e.g., `john-doe`, `mycompany`)
5. Fill in the required information

### Step 2: Get a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on your profile icon (top right) → **"Personal access tokens"**
3. Click **"+ New Token"**
4. Configure the token:
   - **Name**: `VS Code Marketplace Publishing`
   - **Organization**: `All accessible organizations`
   - **Expiration**: Choose your preference (90 days, 1 year, etc.)
   - **Scopes**: Click **"Show all scopes"** and select:
     - ✅ **Marketplace** → **Manage** (this is the important one!)
5. Click **"Create"**
6. **⚠️ COPY THE TOKEN IMMEDIATELY** - you won't be able to see it again!

### Step 3: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the secret:
   - **Name**: `VSCE_TOKEN`
   - **Value**: Paste your PAT from Step 2
5. Click **"Add secret"**

### Step 4: Update package.json

Replace the placeholder values in `package.json`:

```json
{
  "publisher": "YOUR_PUBLISHER_ID",  // ← Replace with your publisher ID from Step 1
  "author": {
    "name": "Your Name"              // ← Your name or company
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/boolean-search-extension.git"  // ← Your repo
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/boolean-search-extension/issues"  // ← Your repo
  },
  "homepage": "https://github.com/YOUR_USERNAME/boolean-search-extension#readme"  // ← Your repo
}
```

### Step 5: Commit and Push

```bash
git add .github/workflows/publish.yml package.json
git commit -m "Add GitHub Action for automated publishing"
git push origin main
```

---

## 📦 How to Publish

### Option 1: Publish on Tag (Recommended)

The workflow triggers automatically when you push a version tag:

```bash
# Update version in package.json (e.g., to 0.2.0)
npm version patch   # or 'minor' or 'major'

# Push the tag
git push origin main --tags
```

The GitHub Action will:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Compile TypeScript
4. ✅ Run linter
5. ✅ Package the extension (.vsix file)
6. ✅ Publish to VS Code Marketplace
7. ✅ Upload the .vsix as an artifact

### Option 2: Manual Trigger

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"Publish Extension"** workflow
4. Click **"Run workflow"**
5. Select branch and click **"Run workflow"**

---

## 📝 Version Management

### Semantic Versioning

Follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

### Update Version

```bash
# Patch (0.1.0 → 0.1.1)
npm version patch

# Minor (0.1.0 → 0.2.0)
npm version minor

# Major (0.1.0 → 1.0.0)
npm version major
```

Then push:
```bash
git push origin main --tags
```

---

## 🔍 Verify Publication

After the workflow completes:

1. **Check the Action**: Go to **Actions** tab on GitHub to see if it succeeded
2. **Check Marketplace**: Visit your extension at:
   ```
   https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_ID.boolean-search
   ```
3. **Install in VS Code**: 
   - Open VS Code
   - Go to Extensions
   - Search for "Boolean Search"
   - Install!

---

## 🎨 Recommended: Add an Icon

Create an icon for your extension:

1. Create a 128x128 PNG image (e.g., `icon.png`)
2. Add to `package.json`:
   ```json
   {
     "icon": "icon.png"
   }
   ```
3. Commit and publish

---

## 🛠️ Local Testing Before Publishing

Test the package locally before publishing:

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Package the extension
vsce package

# This creates a .vsix file you can install manually in VS Code
# Extensions → ... menu → Install from VSIX
```

---

## 📊 Workflow File Explained

The `.github/workflows/publish.yml` file:

```yaml
on:
  push:
    tags:
      - 'v*'           # Triggers on version tags (v1.0.0, v2.0.0, etc.)
  workflow_dispatch:   # Allows manual trigger from GitHub UI

jobs:
  publish:
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies (npm ci)
      - Compile TypeScript
      - Run linter
      - Install vsce (VS Code Extension Manager)
      - Package extension (.vsix)
      - Publish to marketplace using VSCE_TOKEN
      - Upload .vsix as artifact (for download)
```

---

## 🔒 Security Notes

- **Never commit your PAT** - always use GitHub Secrets
- **Rotate your PAT** periodically (Azure DevOps allows setting expiration)
- **Limit token scope** to only Marketplace → Manage
- If token is compromised, revoke it immediately in Azure DevOps

---

## ❓ Troubleshooting

### Error: "Publisher not found"
- Check your publisher ID in package.json matches Azure
- Verify you created the publisher in Step 1

### Error: "Authentication failed"
- Your PAT may have expired or be invalid
- Regenerate token in Azure DevOps
- Update GitHub secret with new token

### Error: "Extension validation failed"
- Check that package.json has all required fields
- Ensure version is newer than currently published version
- Run `vsce package` locally to see validation errors

### Workflow doesn't trigger
- Check that you pushed tags: `git push --tags`
- Verify workflow file is in `.github/workflows/`
- Check GitHub Actions tab for errors

---

## 🚦 Publishing Checklist

Before your first publish:
- [ ] Created publisher ID on VS Code Marketplace
- [ ] Generated Azure PAT with Marketplace → Manage scope
- [ ] Added VSCE_TOKEN to GitHub Secrets
- [ ] Updated package.json with your publisher ID
- [ ] Updated repository URLs in package.json
- [ ] Added README.md with usage instructions
- [ ] Added LICENSE file
- [ ] (Optional) Added icon.png
- [ ] Tested extension locally
- [ ] Committed all changes

For each release:
- [ ] Updated version number
- [ ] Updated CHANGELOG.md
- [ ] Tested functionality
- [ ] Committed changes
- [ ] Created and pushed tag
- [ ] Monitored GitHub Action
- [ ] Verified on marketplace

---

## 📚 Resources

- [VS Code Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
- [Azure Personal Access Tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎉 That's It!

Once setup is complete, publishing is as simple as:

```bash
npm version patch
git push origin main --tags
```

Your extension will automatically be published to the VS Code Marketplace! 🚀

