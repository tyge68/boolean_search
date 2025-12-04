# Boolean Query Parser - Implementation Summary

## What Was Fixed

The parser now supports complex boolean queries with multiple operators, including your requested query: **`aaa AND bbb NOT ccc`**

## How It Works

### Query Structure

The parser builds an Abstract Syntax Tree (AST) with proper operator precedence:

**Operator Precedence (highest to lowest):**
1. **NOT** (highest precedence)
2. **AND** (medium precedence)  
3. **OR** (lowest precedence)

### Example Parse Trees

#### `aaa AND bbb NOT ccc`
```
AND
  ├─ TERM: "aaa"
  └─ AND
      ├─ TERM: "bbb"
      └─ NOT
          └─ TERM: "ccc"
```
**Meaning:** Files containing "aaa" AND "bbb" but NOT "ccc"

#### `aaa NOT bbb`
```
AND
  ├─ TERM: "aaa"
  └─ NOT
      └─ TERM: "bbb"
```
**Meaning:** Files containing "aaa" but NOT "bbb"

#### `aaa AND bbb NOT ccc NOT ddd`
```
AND
  ├─ TERM: "aaa"
  └─ AND
      ├─ AND
      │   ├─ TERM: "bbb"
      │   └─ NOT
      │       └─ TERM: "ccc"
      └─ NOT
          └─ TERM: "ddd"
```
**Meaning:** Files containing "aaa" and "bbb", but NOT "ccc" and NOT "ddd"

#### `aaa OR bbb AND ccc NOT ddd`
```
OR
  ├─ TERM: "aaa"
  └─ AND
      ├─ TERM: "bbb"
      └─ AND
          ├─ TERM: "ccc"
          └─ NOT
              └─ TERM: "ddd"
```
**Meaning:** Files containing "aaa", OR files with "bbb" and "ccc" but not "ddd"

## Test Files

Three test files have been created:

### 1. `test-queries.md`
Comprehensive documentation of query patterns with examples

### 2. `test-files/test-match.txt`
Contains: `aaa`, `bbb` (but NOT `ccc`)
- ✅ **SHOULD MATCH**: `aaa AND bbb NOT ccc`

### 3. `test-files/test-no-match.txt`  
Contains: `aaa`, `bbb`, `ccc`
- ❌ **SHOULD NOT MATCH**: `aaa AND bbb NOT ccc` (because it has `ccc`)

## Running the Demo

```bash
# Compile TypeScript
npm run compile

# Run parser test
node test-parser.js
```

## Key Implementation Details

1. **Tokenizer** - Splits query into terms and operators
2. **Recursive Descent Parser** - Builds AST respecting precedence
3. **File Matching** - Recursively evaluates AST against file content
4. **Line Highlighting** - Extracts positive terms for result display

## NOT Operator Behavior

`NOT` is implemented as a binary operator that requires a left operand:
- `aaa NOT bbb` → internally: `aaa AND (NOT bbb)`
- This ensures NOT is always applied in the context of other terms

