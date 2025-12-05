# 📋 Publishing Setup Checklist

Use this checklist to set up automated publishing for your VS Code extension.

## ⚡ Quick Start (5 minutes)

### 1. Update package.json
Replace these placeholders in `package.json`:

```json
"publisher": "YOUR_PUBLISHER_ID",        // ← Your publisher ID
"author": {
  "name": "Your Name"                    // ← Your name
},
"repository": {
  "url": "https://github.com/USERNAME/REPO.git"  // ← Your GitHub URL
}
```

### 2. Create VS Code Marketplace Publisher
- Go to: https://marketplace.visualstudio.com/manage
- Sign in with Microsoft account
- Click "Create publisher"
- Remember your publisher ID!

### 3. Get Azure Personal Access Token (PAT)
- Go to: https://dev.azure.com/
- User Settings → Personal Access Tokens → + New Token
- Scopes: **Marketplace → Manage** ✅
- Copy the token (you won't see it again!)

### 4. Add Token to GitHub
- Your GitHub repo → Settings → Secrets and variables → Actions
- New repository secret:
  - Name: `VSCE_TOKEN`
  - Value: [paste your token]

### 5. Commit and Tag
```bash
git add .
git commit -m "Setup automated publishing"
git push origin main

# Create first release
npm version 0.1.0
git push origin main --tags
```

✅ **Done!** Your extension will auto-publish to the marketplace!

---

## 📝 Detailed Checklist

### Pre-Publishing Setup

- [ ] **Create Publisher ID**
  - URL: https://marketplace.visualstudio.com/manage
  - Save your publisher ID: `_______________`

- [ ] **Generate Azure PAT**
  - URL: https://dev.azure.com/
  - Token name: `VS Code Marketplace Publishing`
  - Scope: Marketplace → Manage ✅
  - Expiration: _________ (mark your calendar!)
  - Token saved securely: ☐

- [ ] **Add GitHub Secret**
  - Repo → Settings → Secrets → Actions
  - Secret name: `VSCE_TOKEN` ✅
  - Value: [PAT from above] ✅

### Update Files

- [ ] **package.json**
  - [ ] `publisher` field
  - [ ] `author.name` field
  - [ ] `repository.url` field
  - [ ] `bugs.url` field
  - [ ] `homepage` field
  - [ ] Optional: add `icon` field

- [ ] **README.md**
  - [ ] Usage instructions
  - [ ] Screenshots/GIFs
  - [ ] Installation instructions
  - [ ] Features list

- [ ] **LICENSE**
  - [ ] License file exists
  - [ ] `license` field in package.json matches

- [ ] **CHANGELOG.md**
  - [ ] Version history started
  - [ ] Current version documented

### Optional But Recommended

- [ ] **Add Icon**
  - [ ] Create 128x128 PNG
  - [ ] Add to root directory
  - [ ] Reference in package.json

- [ ] **Add Categories**
  - Current: "Other"
  - Consider: "Programming Languages", "Snippets", "Debuggers", etc.

- [ ] **Add Keywords**
  - Already added: search, boolean, AND, OR, NOT, query, filter, find
  - Add more for discoverability

### Testing

- [ ] **Local Package Test**
  ```bash
  npm run package
  # Install the .vsix file in VS Code to test
  ```

- [ ] **Test All Features**
  - [ ] Search panel opens
  - [ ] Boolean queries work
  - [ ] Same File mode works
  - [ ] Same Line mode works
  - [ ] Results clickable

### First Release

- [ ] **Commit All Changes**
  ```bash
  git add .
  git commit -m "Prepare for publishing"
  git push origin main
  ```

- [ ] **Create Version Tag**
  ```bash
  npm version 0.1.0
  git push origin main --tags
  ```

- [ ] **Monitor GitHub Action**
  - Go to Actions tab
  - Watch workflow complete
  - Check for errors

- [ ] **Verify Publication**
  - Check: `https://marketplace.visualstudio.com/items?itemName=PUBLISHER.boolean-search`
  - Search for extension in VS Code
  - Install and test

### Post-Publication

- [ ] **Share Your Extension**
  - [ ] Tweet about it
  - [ ] Share on Reddit (r/vscode)
  - [ ] Add to your portfolio
  - [ ] Tell friends/colleagues

- [ ] **Set Up Monitoring**
  - [ ] Watch install count
  - [ ] Monitor reviews
  - [ ] Check for issues

---

## 🎯 Future Releases

Each time you want to release a new version:

```bash
# 1. Make your changes and test

# 2. Update version (choose one)
npm version patch   # 0.1.0 → 0.1.1 (bug fixes)
npm version minor   # 0.1.0 → 0.2.0 (new features)
npm version major   # 0.1.0 → 1.0.0 (breaking changes)

# 3. Update CHANGELOG.md with changes

# 4. Push
git push origin main --tags

# 5. Done! GitHub Action handles the rest
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow not triggering | Make sure you pushed tags: `git push --tags` |
| "Publisher not found" | Update `publisher` field in package.json |
| "Authentication failed" | Check VSCE_TOKEN secret is correct |
| "Extension validation failed" | Run `npm run package` locally to see errors |
| Token expired | Generate new PAT, update GitHub secret |

---

## 📚 Reference Commands

```bash
# Test packaging locally
npm run package

# Install vsce globally (if needed)
npm install -g @vscode/vsce

# Check what will be packaged
vsce ls

# Manual publish (not recommended, use GitHub Action)
vsce publish

# Create pre-release
npm version prerelease --preid=alpha
git push origin main --tags
```

---

## ✅ Status Tracker

**Current Status:** ☐ Not Set Up  /  ☐ In Progress  /  ☐ Ready to Publish  /  ☐ Published

**First Published:** _______________

**Latest Version:** _______________

**Downloads:** _______________

**Rating:** ⭐ _______________

---

## 🎉 Congratulations!

Once you complete this checklist, your extension will be:
- ✅ Published on VS Code Marketplace
- ✅ Automatically updated on each new version tag
- ✅ Available for millions of VS Code users
- ✅ Discoverable through search

**Need help?** Check `PUBLISHING.md` for detailed instructions.

