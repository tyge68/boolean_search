# Quick Start Guide

This guide will help you get the Boolean Search extension up and running in just a few minutes.

## Installation & Running

### Option 1: Run in Development Mode (Recommended for testing)

1. **Open the extension folder in VS Code**:
   ```bash
   cd /Users/tyge/Downloads/audi_invest/boolean-search-extension
   code .
   ```

2. **Install dependencies**:
   Open the integrated terminal in VS Code (`` Ctrl+` ``) and run:
   ```bash
   npm install
   ```

3. **Compile the TypeScript code**:
   ```bash
   npm run compile
   ```

4. **Launch the extension**:
   - Press `F5` in VS Code
   - A new VS Code window will open with "[Extension Development Host]" in the title
   - This window has your extension loaded and ready to use

5. **Test the extension**:
   - In the Extension Development Host window, open any folder/workspace
   - Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)
   - The Boolean Search panel should appear!

### Option 2: Package and Install

1. **Install dependencies and compile**:
   ```bash
   cd /Users/tyge/Downloads/audi_invest/boolean-search-extension
   npm install
   npm run compile
   ```

2. **Install vsce (VS Code Extension Manager)**:
   ```bash
   npm install -g @vscode/vsce
   ```

3. **Package the extension**:
   ```bash
   vsce package
   ```
   This creates a `.vsix` file (e.g., `boolean-search-0.1.0.vsix`)

4. **Install the extension**:
   - Open VS Code
   - Go to Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
   - Click the "..." menu → "Install from VSIX..."
   - Select the generated `.vsix` file

## Using the Extension

### 1. Open the Search Panel

Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)

Or use Command Palette:
- `Cmd+Shift+P` / `Ctrl+Shift+P`
- Type "Boolean Search"
- Select "Boolean Search: Search with Boolean Operators"

### 2. Try Some Example Searches

**Example 1: Find all imports and exports**
```
import AND export
```

**Example 2: Find error handling**
```
error OR exception
```

**Example 3: Find functions without async**
```
function NOT async
```

### 3. Filter by File Type

In the "File pattern" field, try:
- `**/*.ts` for TypeScript files
- `**/*.js` for JavaScript files
- `**/*.py` for Python files

### 4. Navigate Results

Click on any result line to jump directly to that location in your code!

## Troubleshooting

### Extension won't compile

Make sure you have the correct Node.js version:
```bash
node --version  # Should be v18 or higher
```

### Extension not showing up

1. Make sure you're in the Extension Development Host window (check title bar)
2. Try reloading the window: `Cmd+R` or `Ctrl+R`
3. Check the Debug Console in the main VS Code window for errors

### No results found

- Check that you have a workspace folder open
- Verify the file pattern is correct
- Try without a file pattern to search all files

## Development Tips

### Auto-compile on Changes

Run this in the terminal to automatically recompile when you edit the code:
```bash
npm run watch
```

Then you can just reload the Extension Development Host window (`Cmd+R` / `Ctrl+R`) to test changes.

### View Logs

Open the Debug Console in the main VS Code window to see extension logs and errors.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Try creating complex search queries
- Customize the extension for your needs

## Need Help?

If you encounter any issues:
1. Check the Debug Console for error messages
2. Make sure all dependencies are installed (`npm install`)
3. Try deleting `node_modules` and `out` folders, then reinstall and recompile

Enjoy your new Boolean Search extension! 🎉

