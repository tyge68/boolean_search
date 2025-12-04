# Boolean Search Extension for VS Code

A powerful VS Code extension that enables searching across your workspace using boolean operators (AND, OR, NOT) to find files containing multiple search terms.

## Features

- **Boolean Operators**: Use AND, OR, and NOT operators to create complex search queries
- **Interactive UI**: Clean, modern interface with real-time results
- **Click to Navigate**: Click any search result to jump directly to that line in the file
- **File Filtering**: Filter searches by file patterns (e.g., `**/*.ts`, `**/*.js`)
- **Case Sensitivity**: Toggle case-sensitive search on/off
- **Visual Results**: See matching lines with line numbers for easy navigation

## Usage

### Opening the Search Panel

There are two ways to open the Boolean Search panel:

1. **Keyboard Shortcut**: Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)
2. **Command Palette**: 
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Boolean Search: Search with Boolean Operators"
   - Press Enter

### Search Syntax

#### AND Operator
Find files containing **all** specified terms:
```
function AND export
```
This will find files where both "function" and "export" appear in the same line.

#### OR Operator
Find files containing **any** of the specified terms:
```
error OR warning
```
This will find files where either "error" or "warning" appears.

#### NOT Operator
Find files containing the first term but **not** the others:
```
console NOT log
```
This will find files where "console" appears but "log" does not on the same line.

### File Patterns

You can limit your search to specific file types using glob patterns:

- `**/*.ts` - Only TypeScript files
- `**/*.js` - Only JavaScript files
- `**/*.{ts,tsx}` - TypeScript and TSX files
- `src/**/*.py` - Python files in the src directory

Leave the file pattern field empty to search all text files.

### Examples

1. **Find React components that export default**:
   ```
   React AND export default
   ```

2. **Find error or exception handling**:
   ```
   throw OR catch OR error
   ```

3. **Find imports without certain packages**:
   ```
   import NOT react
   ```

## Installation

### From VSIX (Recommended for local use)

1. Open VS Code
2. Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Click the "..." menu at the top of the Extensions view
4. Select "Install from VSIX..."
5. Select the `boolean-search-0.1.0.vsix` file

### From Source

1. Clone or download this repository
2. Open a terminal in the extension directory
3. Run:
   ```bash
   npm install
   npm run compile
   ```
4. Press `F5` to open a new VS Code window with the extension loaded

### Publishing to Marketplace

To publish this extension to the VS Code Marketplace:

1. Install vsce:
   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:
   ```bash
   vsce package
   ```

3. Publish:
   ```bash
   vsce publish
   ```

## Development

### Prerequisites

- Node.js (v18 or higher)
- VS Code (v1.74.0 or higher)

### Building

```bash
npm install
npm run compile
```

### Running in Development

1. Open this folder in VS Code
2. Press `F5` to start debugging
3. A new VS Code window will open with the extension loaded
4. Test the extension using `Cmd+Shift+B` / `Ctrl+Shift+B`

### Project Structure

```
boolean-search-extension/
├── src/
│   ├── extension.ts      # Extension entry point
│   ├── search.ts         # Boolean search logic
│   └── searchPanel.ts    # Webview UI for search interface
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Known Limitations

- Boolean operators currently work on a per-line basis (all terms must be on the same line)
- Advanced query parsing (parentheses for complex queries) is not yet supported
- Binary files are automatically skipped

## Future Enhancements

- [ ] Support for regex patterns in search terms
- [ ] Multi-line boolean search
- [ ] Advanced query syntax with parentheses: `(term1 OR term2) AND term3`
- [ ] Search history
- [ ] Export results to file
- [ ] Replace functionality
- [ ] Fuzzy matching option

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - See LICENSE file for details

## Release Notes

### 0.1.0

Initial release with:
- Boolean search operators (AND, OR, NOT)
- Interactive webview UI
- File pattern filtering
- Case-sensitive search option
- Click-to-navigate results

