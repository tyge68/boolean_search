# Changelog - Boolean Search Extension

## Latest Updates

### ✨ New Features

#### 1. Complex Boolean Query Support
- **Multiple Operators**: Now supports queries with multiple AND, OR, and NOT operators
- **Example**: `aaa AND bbb NOT ccc NOT ddd`
- **Operator Precedence**: 
  - NOT (highest)
  - AND (medium)
  - OR (lowest)

#### 2. Search Modes: Same File vs Same Line
- **Same File Mode (Default)**: Terms can appear anywhere in the file
  - Use for: Document-level filtering, finding files that discuss multiple topics
  - Example: Find files mentioning both "authentication" and "database"
  
- **Same Line Mode**: All boolean conditions must be satisfied on the same line
  - Use for: Finding specific code patterns, precise statements
  - Example: Find lines with both "function" and "export" together

### 🔧 Technical Improvements

#### Parser Enhancements
- **Recursive Descent Parser**: Properly handles operator precedence
- **Abstract Syntax Tree (AST)**: Queries are parsed into a tree structure
- **Binary NOT Operator**: `term1 NOT term2` internally becomes `term1 AND (NOT term2)`

#### Code Structure
- **New Type**: `SearchMode = 'file' | 'line'`
- **Updated Functions**:
  - `searchWithBoolean()` now accepts `searchMode` parameter
  - `matchesQuery()` handles both file-level and line-level matching
  - Added `lineMatchesQuery()` for same-line evaluation

### 📚 Documentation

New documentation files:
- `SEARCH_MODES.md` - Comprehensive guide to search modes with examples
- `PARSER_DEMO.md` - Parser implementation details with parse trees
- `CHANGELOG.md` - This file
- `test-files/demo-search-modes.txt` - Interactive test file showing mode differences

### 🎨 UI Updates

#### Search Panel
- Added radio buttons for "Same File" / "Same Line" selection
- Updated help text to explain search modes
- Enhanced examples with complex query patterns

#### Sidebar
- Compact search mode selector
- Helpful tooltips explaining the difference

### 🧪 Test Files

- `test-parser.js` - Standalone parser tester (run with `node test-parser.js`)
- `test-match.txt` - File that matches `aaa AND bbb NOT ccc`
- `test-no-match.txt` - File that doesn't match (contains ccc)
- `demo-search-modes.txt` - Comprehensive mode comparison examples

### 📖 Example Queries

#### Simple Queries
```
aaa                     → Find "aaa"
aaa AND bbb            → Find both terms
aaa OR bbb             → Find either term
aaa NOT bbb            → Find aaa but not bbb
```

#### Complex Queries
```
aaa AND bbb NOT ccc                → Has aaa and bbb, but not ccc
aaa AND bbb AND ccc NOT ddd        → Has aaa, bbb, ccc, but not ddd
aaa OR bbb AND ccc                 → Has aaa, OR (has both bbb and ccc)
function AND export NOT deprecated → Code pattern search
```

#### Real-World Use Cases
```
# Find exported functions (Same Line mode)
function AND export

# Find class implementations (Same Line mode)
class AND implements

# Find React+TypeScript files (Same File mode)
React AND TypeScript

# Find error logs with database issues (Same Line mode)
Error AND failed AND database

# Find security docs without deprecated info (Same File mode)
security AND authentication NOT deprecated
```

### 🚀 Performance

- File-level filtering prevents unnecessary line-by-line checking
- Recursive evaluation optimized for deep query trees
- Same Line mode can be faster for large files (only matching lines are returned)

### 🔄 Breaking Changes

None! The extension maintains backward compatibility:
- Default search mode is "Same File" (previous behavior)
- Existing queries work exactly as before
- New features are opt-in

### 🐛 Bug Fixes

- Fixed query parsing to handle multiple operators correctly
- Proper operator precedence now enforced
- NOT operator now works correctly in all contexts

---

## How to Use

1. **Open the Search Panel**: Command Palette → "Boolean Search: Open Search Panel"
2. **Enter Your Query**: Use AND, OR, NOT operators
3. **Select Search Mode**: Choose "Same File" or "Same Line"
4. **Configure Options**: Case sensitivity, file patterns
5. **Search**: Click Search or press Enter
6. **Navigate Results**: Click any result to open the file at that line

---

## Development

To test the parser:
```bash
npm run compile
node test-parser.js
```

To build the extension:
```bash
npm run compile
```

To run in VS Code:
- Press F5 to start debugging
- In the Extension Development Host, open a workspace
- Try the search panel with different queries and modes

---

## Future Enhancements

Potential features for future versions:
- [ ] Parentheses support for explicit grouping: `(aaa OR bbb) AND ccc`
- [ ] Regex term support: `/\bfunction\b/`
- [ ] Proximity search: `aaa NEAR bbb` (within N words)
- [ ] Search result export
- [ ] Search history
- [ ] Saved queries
- [ ] Performance metrics display

---

## Feedback

Found a bug or have a feature request? Please file an issue!

