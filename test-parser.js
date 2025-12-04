/**
 * Standalone test script for the boolean query parser
 * Run with: node test-parser.js
 */

// Standalone parser (copied from search.ts for testing)
function tokenize(query) {
    const tokens = [];
    const parts = query.split(/\s+/);
    
    for (const part of parts) {
        if (part.toUpperCase() === 'AND' || part.toUpperCase() === 'OR' || part.toUpperCase() === 'NOT') {
            tokens.push(part.toUpperCase());
        } else if (part.trim()) {
            tokens.push(part.trim());
        }
    }
    
    return tokens;
}

function parseOr(tokens) {
    let left = parseAnd(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'OR') {
        tokens.shift();
        const right = parseAnd(tokens);
        left = { operator: 'OR', left, right };
    }
    
    return left;
}

function parseAnd(tokens) {
    let left = parseNot(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'AND') {
        tokens.shift();
        const right = parseNot(tokens);
        left = { operator: 'AND', left, right };
    }
    
    return left;
}

function parseNot(tokens) {
    let left = parseTerm(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'NOT') {
        tokens.shift();
        const right = parseTerm(tokens);
        // NOT is treated as: left AND (NOT right)
        const notRight = { operator: 'NOT', right };
        left = { operator: 'AND', left, right: notRight };
    }
    
    return left;
}

function parseTerm(tokens) {
    if (tokens.length === 0) {
        throw new Error('Unexpected end of query');
    }
    
    const token = tokens.shift();
    
    if (token === 'AND' || token === 'OR' || token === 'NOT') {
        throw new Error(`Unexpected operator: ${token}`);
    }
    
    return { operator: 'TERM', term: token };
}

function parseQuery(query) {
    const tokens = tokenize(query);
    return parseOr(tokens);
}

// Test runner
console.log('Boolean Search Query Parser Tests\n');
console.log('='.repeat(50) + '\n');

const testQueries = [
    'aaa',
    'aaa AND bbb',
    'aaa OR bbb',
    'aaa NOT bbb',
    'aaa AND bbb NOT ccc',
    'aaa AND bbb AND ccc',
    'aaa OR bbb OR ccc',
    'aaa AND bbb OR ccc',
    'aaa OR bbb AND ccc',
    'aaa AND bbb NOT ccc NOT ddd',
    'aaa OR bbb AND ccc NOT ddd'
];

function formatQuery(query, indent = 0) {
    const prefix = '  '.repeat(indent);
    
    switch (query.operator) {
        case 'TERM':
            return `${prefix}TERM: "${query.term}"`;
        
        case 'NOT':
            return `${prefix}NOT\n${formatQuery(query.right, indent + 1)}`;
        
        case 'AND':
        case 'OR':
            return `${prefix}${query.operator}\n${formatQuery(query.left, indent + 1)}\n${formatQuery(query.right, indent + 1)}`;
        
        default:
            return `${prefix}UNKNOWN`;
    }
}

testQueries.forEach(queryStr => {
    console.log(`Query: "${queryStr}"`);
    console.log('Parse Tree:');
    
    try {
        const parsed = parseQuery(queryStr);
        console.log(formatQuery(parsed));
    } catch (error) {
        console.log(`  ERROR: ${error.message}`);
    }
    
    console.log('\n' + '-'.repeat(50) + '\n');
});

// Interpretation guide
console.log('\n' + '='.repeat(50));
console.log('\nOperator Precedence (highest to lowest):');
console.log('  1. NOT  (highest)');
console.log('  2. AND  (medium)');
console.log('  3. OR   (lowest)');
console.log('\nInterpretation Examples:');
console.log('  "aaa AND bbb NOT ccc"     →  aaa AND (bbb AND (NOT ccc))');
console.log('  "aaa OR bbb AND ccc"      →  aaa OR (bbb AND ccc)');
console.log('  "aaa AND bbb OR ccc"      →  (aaa AND bbb) OR ccc');
console.log('  "aaa AND bbb NOT ccc NOT ddd"  →  aaa AND (bbb AND (NOT (ccc AND (NOT ddd))))');
