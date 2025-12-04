# Boolean Search Query Tests

This file demonstrates various boolean query patterns supported by the extension.

## Test Content

This file contains:
- **aaa** appears here
- **bbb** appears here
- **ccc** appears here
- **ddd** appears here

Line with aaa only.
Line with bbb only.
Line with ccc only.
Line with aaa and bbb together.
Line with aaa and ccc together.
Line with bbb and ccc together.
Line with aaa, bbb, and ccc all together.
Line with ddd only.

## Simple Queries

**Query: `aaa`**
- Should match: lines containing "aaa"

**Query: `aaa AND bbb`**
- Should match: this file (contains both terms)
- Highlights: lines with "aaa" or "bbb"

**Query: `aaa OR bbb`**
- Should match: this file (contains either term)
- Highlights: lines with "aaa" or "bbb"

## Complex Queries with NOT

**Query: `aaa AND bbb NOT ccc`**
- Should match: files with "aaa" AND "bbb" BUT NOT "ccc"
- This file should NOT match (contains all three)

**Query: `aaa NOT ccc`**
- Should match: files with "aaa" but NOT "ccc"
- This file should NOT match (contains both)

**Query: `ddd NOT ccc`**
- Should match: files with "ddd" but NOT "ccc"
- This file should NOT match (contains both)

## Multiple AND/OR Operations

**Query: `aaa AND bbb AND ddd`**
- Should match: files containing all three terms
- This file should match

**Query: `aaa OR bbb OR ccc`**
- Should match: files containing any of the terms
- This file should match

**Query: `aaa AND bbb AND ccc NOT ddd`**
- Should match: files with aaa, bbb, and ccc but NOT ddd
- This file should NOT match (contains ddd)

## Operator Precedence

NOT has highest precedence, then AND, then OR.

**Query: `aaa OR bbb AND ccc`**
- Parses as: `aaa OR (bbb AND ccc)`
- Should match: files with "aaa", OR files with both "bbb" and "ccc"

**Query: `aaa AND bbb OR ccc`**
- Parses as: `(aaa AND bbb) OR ccc`
- Should match: files with both "aaa" and "bbb", OR files with "ccc"

