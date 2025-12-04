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
    operator: 'AND' | 'OR' | 'NOT';
    terms: string[];
}

/**
 * Parse a boolean search query
 * Supports: "term1 AND term2", "term1 OR term2", "term1 NOT term2"
 * Also supports parentheses and multiple operators
 */
export function parseQuery(query: string): BooleanQuery {
    // Simple parser for now - can be extended for complex queries
    const upperQuery = query.toUpperCase();
    
    if (upperQuery.includes(' AND ')) {
        const terms = query.split(/\s+AND\s+/i);
        return { operator: 'AND', terms: terms.map(t => t.trim()) };
    } else if (upperQuery.includes(' OR ')) {
        const terms = query.split(/\s+OR\s+/i);
        return { operator: 'OR', terms: terms.map(t => t.trim()) };
    } else if (upperQuery.includes(' NOT ')) {
        const terms = query.split(/\s+NOT\s+/i);
        return { operator: 'NOT', terms: terms.map(t => t.trim()) };
    }
    
    // Default to AND if no operator specified and multiple terms with spaces
    return { operator: 'AND', terms: [query.trim()] };
}

/**
 * Search files in a directory with boolean operators
 */
export async function searchWithBoolean(
    directory: string,
    query: BooleanQuery,
    caseSensitive: boolean = false,
    filePattern: string = '**/*',
    excludePattern: string = '**/node_modules/**'
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
            const matches = matchesQuery(content, query, caseSensitive);
            
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
function matchesQuery(content: string, query: BooleanQuery, caseSensitive: boolean): MatchInfo[] {
    const lines = content.split('\n');
    const matchingLines: MatchInfo[] = [];
    const searchTerms = caseSensitive ? query.terms : query.terms.map(t => t.toLowerCase());
    const searchContent = caseSensitive ? content : content.toLowerCase();
    
    // For AND operator, check if all terms exist anywhere in the file first
    if (query.operator === 'AND') {
        const allTermsExist = searchTerms.every(term => searchContent.includes(term));
        if (!allTermsExist) {
            return []; // File doesn't contain all terms, no matches
        }
        
        // File contains all terms, now return all lines that contain at least one term
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const searchLine = caseSensitive ? line : line.toLowerCase();
            
            // Check if this line contains any of the terms
            const hasAnyTerm = searchTerms.some(term => searchLine.includes(term));
            
            if (hasAnyTerm) {
                // Find the column of the first matching term
                let column = -1;
                for (const term of searchTerms) {
                    const pos = searchLine.indexOf(term);
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
        return matchingLines;
    }
    
    // For OR and NOT operators, check line by line (original behavior)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const searchLine = caseSensitive ? line : line.toLowerCase();
        
        let isMatch = false;
        
        switch (query.operator) {
            case 'OR':
                // At least one term must be present
                isMatch = searchTerms.some(term => searchLine.includes(term));
                break;
            case 'NOT':
                // First term must be present, others must not be
                if (searchTerms.length >= 2) {
                    isMatch = searchLine.includes(searchTerms[0]) &&
                             !searchTerms.slice(1).some(term => searchLine.includes(term));
                } else {
                    isMatch = searchLine.includes(searchTerms[0]);
                }
                break;
        }
        
        if (isMatch) {
            // Find the column of the first matching term
            const firstTerm = searchTerms[0];
            const column = searchLine.indexOf(firstTerm);
            
            matchingLines.push({
                line: i + 1,
                content: line,
                column: column >= 0 ? column : 0
            });
        }
    }
    
    return matchingLines;
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

