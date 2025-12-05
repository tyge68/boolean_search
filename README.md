# Boolean Search Extension for VS Code

A powerful VS Code extension that enables searching across your workspace using boolean operators (AND, OR, NOT) to find files containing multiple search terms.

## ✨ Features

- **🔍 Boolean Operators**: Use AND, OR, and NOT operators to create complex search queries
- **🎯 Multiple Operators**: Support for queries like `aaa AND bbb NOT ccc NOT ddd`
- **📏 Search Modes**: Choose between "Same File" (default) or "Same Line" matching
- **🎨 Interactive UI**: Clean, modern interface with real-time results
- **👆 Click to Navigate**: Click any search result to jump directly to that line in the file
- **📁 File Filtering**: Filter searches by file patterns (e.g., `**/*.ts`, `**/*.js`)
- **🔠 Case Sensitivity**: Toggle case-sensitive search on/off
- **📊 Visual Results**: See matching lines with line numbers for easy navigation
- **⚡ Fast**: Efficient search across large codebases
- **🌳 Smart Parsing**: Proper operator precedence (NOT > AND > OR)

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
- **Same File mode**: Both "function" and "export" appear anywhere in the file
- **Same Line mode**: Both terms appear on the same line

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
- **Same File mode**: "console" appears but "log" does not appear anywhere in the file
- **Same Line mode**: Lines where "console" appears but "log" does not

#### Complex Queries
Combine multiple operators in one query:
```
aaa AND bbb NOT ccc
aaa AND bbb AND ccc NOT ddd
aaa OR bbb AND ccc
```

**Operator Precedence** (highest to lowest):
1. NOT (highest)
2. AND
3. OR (lowest)

Example: `aaa OR bbb AND ccc` is evaluated as `aaa OR (bbb AND ccc)`

### Search Modes

#### Same File Mode (Default)
Terms can appear **anywhere** in the file. Use for:
- Finding files that discuss multiple topics
- Document-level filtering
- Broad searches across file content

#### Same Line Mode
**All terms must appear on the same line**. Use for:
- Finding specific code patterns
- Precise statement matching
- Lines with multiple keywords together

**Example:**
- Query: `function AND export`
- Same File: Shows files with both words anywhere
- Same Line: Shows only lines like `export function myFunc()`

### File Patterns

You can limit your search to specific file types using glob patterns:

- `**/*.ts` - Only TypeScript files
- `**/*.js` - Only JavaScript files
- `**/*.{ts,tsx}` - TypeScript and TSX files
- `src/**/*.py` - Python files in the src directory

Leave the file pattern field empty to search all text files.

### Examples

#### Code Search Examples

1. **Find exported functions** (Same Line mode):
   ```
   function AND export
   ```

2. **Find class implementations** (Same Line mode):
   ```
   class AND implements
   ```

3. **Find React+TypeScript files** (Same File mode):
   ```
   React AND TypeScript
   ```

4. **Find error or exception handling**:
   ```
   throw OR catch OR error
   ```

5. **Find imports without deprecated packages**:
   ```
   import NOT deprecated
   ```

6. **Find authentication without specific library**:
   ```
   authentication AND password NOT bcrypt
   ```

#### Real-World Use Cases

- **Finding exported constants**: `export AND const` (Same Line)
- **Security audits**: `password AND hash NOT encrypt` (Same File)
- **Finding TODO comments**: `TODO OR FIXME OR HACK` (Same Line)
- **Database queries**: `query AND database NOT mongodb` (Same File)
- **Error logs**: `Error AND failed AND connection` (Same Line)

## Installation

### From VS Code Marketplace (Recommended)

1. Open VS Code
2. Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Search for "Boolean Search"
4. Click **Install**

Or visit the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) (update link after publishing).

### From VSIX File

1. Download the `.vsix` file from [Releases](../../releases)
2. Open VS Code
3. Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
4. Click the "..." menu at the top of the Extensions view
5. Select "Install from VSIX..."
6. Select the downloaded `.vsix` file

### From Source (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/boolean-search-extension.git
   cd boolean-search-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile TypeScript:
   ```bash
   npm run compile
   ```

4. Press `F5` in VS Code to open Extension Development Host

### For Publishers

See [PUBLISHING.md](./PUBLISHING.md) for detailed instructions on publishing this extension to the VS Code Marketplace.

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

- Parentheses for explicit grouping not yet supported: `(term1 OR term2) AND term3`
- Binary files are automatically skipped
- node_modules excluded by default

## Future Enhancements

- [ ] Parentheses support for explicit grouping
- [ ] Regex patterns in search terms
- [ ] Proximity search: `term1 NEAR term2`
- [ ] Search history
- [ ] Export results to file
- [ ] Replace functionality
- [ ] Fuzzy matching option
- [ ] Search within selection

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - See LICENSE file for details

## Release Notes

### 0.1.0

Initial release featuring:

**Core Search Features:**
- Boolean search operators (AND, OR, NOT)
- Complex queries with multiple operators
- Proper operator precedence (NOT > AND > OR)
- Two search modes: Same File and Same Line

**User Interface:**
- Interactive webview UI in sidebar and panel
- File pattern filtering
- Case-sensitive search option
- Click-to-navigate results
- Keyboard shortcut: `Cmd/Ctrl+Shift+B`

**Performance:**
- Fast search across large codebases
- Automatic exclusion of node_modules
- Efficient file-level filtering

See [CHANGELOG.md](./CHANGELOG.md) for detailed updates.

