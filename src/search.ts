import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface SearchResult {
    file: string;
    matches: MatchInfo[];
}

export interface MatchInfo {
    line: number;
    content: string;
    column: number;
}

export interface BooleanQuery {
    operator: 'AND' | 'OR' | 'NOT' | 'TERM';
    terms?: string[];
    left?: BooleanQuery;
    right?: BooleanQuery;
    term?: string;
}

/**
 * Parse a boolean search query
 * Supports: "term1 AND term2", "term1 OR term2", "term1 NOT term2"
 * Also supports multiple operators: "aaa AND bbb NOT ccc"
 * Operator precedence: NOT > AND > OR
 */
export function parseQuery(query: string): BooleanQuery {
    const tokens = tokenize(query);
    return parseOr(tokens);
}

function tokenize(query: string): string[] {
    // Split by whitespace but keep operators as separate tokens
    const tokens: string[] = [];
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

// Parse OR (lowest precedence)
function parseOr(tokens: string[]): BooleanQuery {
    let left = parseAnd(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'OR') {
        tokens.shift(); // consume OR
        const right = parseAnd(tokens);
        left = { operator: 'OR', left, right };
    }
    
    return left;
}

// Parse AND (medium precedence)
function parseAnd(tokens: string[]): BooleanQuery {
    let left = parseNot(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'AND') {
        tokens.shift(); // consume AND
        const right = parseNot(tokens);
        left = { operator: 'AND', left, right };
    }
    
    return left;
}

// Parse NOT (highest precedence)
function parseNot(tokens: string[]): BooleanQuery {
    let left = parseTerm(tokens);
    
    while (tokens.length > 0 && tokens[0] === 'NOT') {
        tokens.shift(); // consume NOT
        const right = parseTerm(tokens);
        // NOT is treated as: left AND (NOT right)
        const notRight = { operator: 'NOT' as const, right };
        left = { operator: 'AND', left, right: notRight };
    }
    
    return left;
}

// Parse a single term
function parseTerm(tokens: string[]): BooleanQuery {
    if (tokens.length === 0) {
        throw new Error('Unexpected end of query');
    }
    
    const token = tokens.shift()!;
    
    if (token === 'AND' || token === 'OR' || token === 'NOT') {
        throw new Error(`Unexpected operator: ${token}`);
    }
    
    return { operator: 'TERM', term: token };
}

export type SearchMode = 'file' | 'line';

/**
 * Search files in a directory with boolean operators
 * @param searchMode - 'file' means terms can be anywhere in the file (default), 'line' means all terms must be on the same line
 */
export async function searchWithBoolean(
    directory: string,
    query: BooleanQuery,
    caseSensitive: boolean = false,
    filePattern: string = '**/*',
    excludePattern: string = '**/node_modules/**',
    searchMode: SearchMode = 'file'
): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Get all files matching the pattern
    const files = await vscode.workspace.findFiles(
        filePattern,
        excludePattern
    );
    
    for (const fileUri of files) {
        try {
            const content = fs.readFileSync(fileUri.fsPath, 'utf-8');
            const matches = matchesQuery(content, query, caseSensitive, searchMode);
            
            if (matches.length > 0) {
                results.push({
                    file: fileUri.fsPath,
                    matches: matches
                });
            }
        } catch (error) {
            // Skip files that can't be read (binary, etc.)
            continue;
        }
    }
    
    return results;
}

/**
 * Check if content matches the boolean query and return match locations
 */
function matchesQuery(content: string, query: BooleanQuery, caseSensitive: boolean, searchMode: SearchMode): MatchInfo[] {
    const lines = content.split('\n');
    const matchingLines: MatchInfo[] = [];
    
    if (searchMode === 'file') {
        // FILE MODE: terms can be anywhere in the file
        // First check if the file matches the query at all
        if (!fileMatchesQuery(content, query, caseSensitive)) {
            return [];
        }
        
        // File matches, now find all matching lines
        const relevantTerms = extractTerms(query);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const searchLine = caseSensitive ? line : line.toLowerCase();
            
            // Check if this line contains any relevant term
            let hasRelevantTerm = false;
            let column = -1;
            
            for (const term of relevantTerms) {
                const searchTerm = caseSensitive ? term : term.toLowerCase();
                const pos = searchLine.indexOf(searchTerm);
                if (pos >= 0) {
                    hasRelevantTerm = true;
                    if (column < 0 || pos < column) {
                        column = pos;
                    }
                }
            }
            
            if (hasRelevantTerm) {
                matchingLines.push({
                    line: i + 1,
                    content: line,
                    column: column >= 0 ? column : 0
                });
            }
        }
    } else {
        // LINE MODE: all terms must be on the same line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if this line matches the query
            if (lineMatchesQuery(line, query, caseSensitive)) {
                // Find the column of the first matching term
                const relevantTerms = extractTerms(query);
                const searchLine = caseSensitive ? line : line.toLowerCase();
                let column = -1;
                
                for (const term of relevantTerms) {
                    const searchTerm = caseSensitive ? term : term.toLowerCase();
                    const pos = searchLine.indexOf(searchTerm);
                    if (pos >= 0 && (column < 0 || pos < column)) {
                        column = pos;
                    }
                }
                
                matchingLines.push({
                    line: i + 1,
                    content: line,
                    column: column >= 0 ? column : 0
                });
            }
        }
    }
    
    return matchingLines;
}

/**
 * Check if the entire file content matches the query
 */
function fileMatchesQuery(content: string, query: BooleanQuery, caseSensitive: boolean): boolean {
    const searchContent = caseSensitive ? content : content.toLowerCase();
    
    switch (query.operator) {
        case 'TERM':
            const searchTerm = caseSensitive ? query.term! : query.term!.toLowerCase();
            return searchContent.includes(searchTerm);
            
        case 'AND':
            return fileMatchesQuery(content, query.left!, caseSensitive) &&
                   fileMatchesQuery(content, query.right!, caseSensitive);
            
        case 'OR':
            return fileMatchesQuery(content, query.left!, caseSensitive) ||
                   fileMatchesQuery(content, query.right!, caseSensitive);
            
        case 'NOT':
            return !fileMatchesQuery(content, query.right!, caseSensitive);
            
        default:
            return false;
    }
}

/**
 * Check if a single line matches the query
 */
function lineMatchesQuery(line: string, query: BooleanQuery, caseSensitive: boolean): boolean {
    const searchLine = caseSensitive ? line : line.toLowerCase();
    
    switch (query.operator) {
        case 'TERM':
            const searchTerm = caseSensitive ? query.term! : query.term!.toLowerCase();
            return searchLine.includes(searchTerm);
            
        case 'AND':
            return lineMatchesQuery(line, query.left!, caseSensitive) &&
                   lineMatchesQuery(line, query.right!, caseSensitive);
            
        case 'OR':
            return lineMatchesQuery(line, query.left!, caseSensitive) ||
                   lineMatchesQuery(line, query.right!, caseSensitive);
            
        case 'NOT':
            return !lineMatchesQuery(line, query.right!, caseSensitive);
            
        default:
            return false;
    }
}

/**
 * Extract all positive terms from the query (for highlighting)
 */
function extractTerms(query: BooleanQuery): string[] {
    const terms: string[] = [];
    
    switch (query.operator) {
        case 'TERM':
            if (query.term) {
                terms.push(query.term);
            }
            break;
            
        case 'AND':
        case 'OR':
            if (query.left) {
                terms.push(...extractTerms(query.left));
            }
            if (query.right) {
                terms.push(...extractTerms(query.right));
            }
            break;
            
        case 'NOT':
            // Don't include negated terms in highlights
            break;
    }
    
    return terms;
}

/**
 * Format search results for display
 */
export function formatResults(results: SearchResult[]): string {
    if (results.length === 0) {
        return 'No results found.';
    }
    
    let output = `Found ${results.length} file(s) with matches:\n\n`;
    
    for (const result of results) {
        output += `📄 ${result.file}\n`;
        output += `   ${result.matches.length} match(es):\n`;
        
        for (const match of result.matches.slice(0, 5)) { // Show first 5 matches per file
            output += `   Line ${match.line}: ${match.content.trim()}\n`;
        }
        
        if (result.matches.length > 5) {
            output += `   ... and ${result.matches.length - 5} more match(es)\n`;
        }
        
        output += '\n';
    }
    
    return output;
}

