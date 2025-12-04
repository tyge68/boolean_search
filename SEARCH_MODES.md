# Search Modes: Same File vs Same Line

The boolean search extension now supports two search modes that change how boolean operators are evaluated.

## 🔍 Same File Mode (Default)

In **Same File** mode, boolean operators are evaluated across the entire file:
- Terms can appear **anywhere** in the file
- If the file matches the query, all lines containing relevant terms are highlighted

### Example: `aaa AND bbb NOT ccc`

**File Content:**
```
Line 1: This line has aaa
Line 2: This line has bbb  
Line 3: Another line with aaa and bbb together
Line 4: Some other content
```

**Result in Same File Mode:**
- ✅ **File MATCHES** (contains both "aaa" and "bbb", no "ccc")
- **Lines shown:** Lines 1, 2, and 3 (all lines with "aaa" or "bbb")

---

## 📏 Same Line Mode

In **Same Line** mode, boolean operators are evaluated line-by-line:
- **ALL terms** must appear on the **same line**
- Only lines that satisfy the complete query are shown

### Example: `aaa AND bbb NOT ccc`

**File Content:**
```
Line 1: This line has aaa
Line 2: This line has bbb  
Line 3: Another line with aaa and bbb together
Line 4: Some other content
```

**Result in Same Line Mode:**
- **Line 1:** ❌ Has "aaa" but not "bbb"
- **Line 2:** ❌ Has "bbb" but not "aaa"
- **Line 3:** ✅ **MATCHES** (has both "aaa" and "bbb", no "ccc")
- **Line 4:** ❌ Doesn't have required terms

**Lines shown:** Only Line 3

---

## 📊 Comparison Table

| Query | File Content | Same File Mode | Same Line Mode |
|-------|--------------|----------------|----------------|
| `aaa AND bbb` | Line 1: aaa<br>Line 2: bbb | ✅ Matches<br>Shows: Lines 1, 2 | ❌ No matches |
| `aaa AND bbb` | Line 1: aaa and bbb | ✅ Matches<br>Shows: Line 1 | ✅ Matches<br>Shows: Line 1 |
| `aaa OR bbb` | Line 1: aaa<br>Line 2: bbb | ✅ Matches<br>Shows: Lines 1, 2 | ✅ Matches<br>Shows: Lines 1, 2 |
| `aaa NOT bbb` | Line 1: aaa<br>Line 2: bbb | ❌ No match (file has bbb) | ✅ Matches<br>Shows: Line 1 only |
| `aaa NOT bbb` | Line 1: aaa and bbb | ❌ No match | ❌ No match |

---

## 🎯 When to Use Each Mode

### Use **Same File Mode** when:
- You want to find files that discuss multiple related topics
- Terms might be in different sections of the file
- You're doing document-level filtering
- Example: "Find files that mention both 'authentication' AND 'database'"

### Use **Same Line Mode** when:
- You want to find specific statements or declarations
- Terms must appear together in context
- You're looking for precise code patterns
- Example: "Find lines with 'function' AND 'export' together"

---

## 💡 Common Use Cases

### Code Search Examples

**Finding exported functions:**
```
Query: function AND export
Mode: Same Line
Result: Lines like "export function myFunction() {"
```

**Finding class implementations:**
```
Query: class AND implements
Mode: Same Line
Result: Lines like "class MyClass implements Interface {"
```

**Finding files that use both React and TypeScript:**
```
Query: React AND TypeScript
Mode: Same File
Result: Files that import/mention both
```

### Text Search Examples

**Finding paragraphs with multiple keywords:**
```
Query: security AND authentication NOT deprecated
Mode: Same File
Result: Documents discussing security and authentication (excluding deprecated info)
```

**Finding specific error messages:**
```
Query: Error AND failed AND database
Mode: Same Line
Result: Log lines like "Error: Connection failed to database"
```

---

## ⚙️ Technical Details

### Same File Mode Logic
1. Parse the query into an AST
2. Evaluate the query against the entire file content
3. If file matches, extract all lines containing positive terms
4. Return all matching lines

### Same Line Mode Logic
1. Parse the query into an AST
2. Evaluate the query against **each line** individually
3. Only return lines that satisfy the complete query
4. Each line is independent

### Operator Behavior

Both modes respect operator precedence:
- **NOT** (highest precedence)
- **AND** (medium precedence)
- **OR** (lowest precedence)

Example: `aaa OR bbb AND ccc` parses as `aaa OR (bbb AND ccc)`

---

## 🧪 Testing the Modes

Use the test files in `test-files/`:
- `test-match.txt` - Contains "aaa" and "bbb" but NOT "ccc"
- `test-no-match.txt` - Contains "aaa", "bbb", AND "ccc"
- `test-queries.md` - Comprehensive test scenarios

Try these queries in both modes:
1. `aaa AND bbb`
2. `aaa AND bbb NOT ccc`
3. `aaa OR bbb`
4. `function AND export` (on your code files)

