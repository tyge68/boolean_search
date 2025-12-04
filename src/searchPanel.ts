import * as vscode from 'vscode';
import { searchWithBoolean, parseQuery, formatResults, SearchResult } from './search';

export class SearchPanel {
    public static currentPanel: SearchPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlContent();
        
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'search':
                        await this.performSearch(
                            message.query,
                            message.caseSensitive,
                            message.filePattern
                        );
                        break;
                    case 'openFile':
                        await this.openFile(message.file, message.line);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    public static createOrShow() {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (SearchPanel.currentPanel) {
            SearchPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'booleanSearch',
            'Boolean Search',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        SearchPanel.currentPanel = new SearchPanel(panel);
    }

    private async performSearch(query: string, caseSensitive: boolean, filePattern: string) {
        if (!query) {
            this._panel.webview.postMessage({
                command: 'searchResults',
                results: 'Please enter a search query.'
            });
            return;
        }

        // Show searching status
        this._panel.webview.postMessage({
            command: 'searchResults',
            results: 'Searching...'
        });

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                this._panel.webview.postMessage({
                    command: 'searchResults',
                    results: 'No workspace folder open.'
                });
                return;
            }

            const parsedQuery = parseQuery(query);
            const results = await searchWithBoolean(
                workspaceFolders[0].uri.fsPath,
                parsedQuery,
                caseSensitive,
                filePattern || '**/*',
                '**/node_modules/**'
            );

            this._panel.webview.postMessage({
                command: 'searchResults',
                results: this._formatResultsAsHtml(results, query)
            });
        } catch (error) {
            this._panel.webview.postMessage({
                command: 'searchResults',
                results: `Error: ${error}`
            });
        }
    }

    private async openFile(file: string, line: number) {
        const document = await vscode.workspace.openTextDocument(file);
        const editor = await vscode.window.showTextDocument(document);
        
        const position = new vscode.Position(line - 1, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.InCenter
        );
    }

    private _formatResultsAsHtml(results: SearchResult[], query: string): string {
        if (results.length === 0) {
            return '<div class="no-results">No results found for: <strong>' + this._escapeHtml(query) + '</strong></div>';
        }

        let html = `<div class="results-summary">Found ${results.length} file(s) with matches for: <strong>${this._escapeHtml(query)}</strong></div>`;

        for (const result of results) {
            const relativePath = vscode.workspace.asRelativePath(result.file);
            html += `<div class="file-result">`;
            html += `<div class="file-header">📄 ${this._escapeHtml(relativePath)} (${result.matches.length} matches)</div>`;
            
            for (const match of result.matches) {
                html += `<div class="match-line" data-file="${this._escapeHtml(result.file)}" data-line="${match.line}">`;
                html += `<span class="line-number">Line ${match.line}:</span> `;
                html += `<span class="match-content">${this._escapeHtml(match.content.trim())}</span>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }

        return html;
    }

    private _escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private _getHtmlContent(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boolean Search</title>
    <style>
        body {
            padding: 20px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .search-container {
            margin-bottom: 20px;
        }
        .search-input {
            width: 100%;
            padding: 10px;
            font-size: 14px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .search-options {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
            align-items: center;
        }
        .search-options label {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .search-button {
            padding: 8px 20px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .search-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .help-text {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 15px;
            padding: 10px;
            background-color: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
        }
        .results-container {
            margin-top: 20px;
        }
        .results-summary {
            font-weight: bold;
            margin-bottom: 15px;
            padding: 10px;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 4px;
        }
        .file-result {
            margin-bottom: 20px;
            border-left: 3px solid var(--vscode-focusBorder);
            padding-left: 10px;
        }
        .file-header {
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--vscode-textLink-foreground);
        }
        .match-line {
            padding: 5px;
            margin: 3px 0;
            background-color: var(--vscode-editor-lineHighlightBackground);
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .match-line:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .line-number {
            color: var(--vscode-editorLineNumber-foreground);
            font-weight: bold;
            margin-right: 10px;
        }
        .match-content {
            font-family: var(--vscode-editor-font-family);
        }
        .no-results {
            padding: 20px;
            text-align: center;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="search-container">
        <h2>Boolean Search</h2>
        <div class="help-text">
            <strong>Usage:</strong><br>
            • <code>term1 AND term2</code> - Find files containing both terms<br>
            • <code>term1 OR term2</code> - Find files containing either term<br>
            • <code>term1 NOT term2</code> - Find files containing term1 but not term2<br>
            • Click on any result to open the file at that line
        </div>
        
        <input type="text" id="searchQuery" class="search-input" placeholder="Enter search query (e.g., 'function AND export')">
        
        <input type="text" id="filePattern" class="search-input" placeholder="File pattern (e.g., **/*.ts, **/*.js) - leave empty for all files">
        
        <div class="search-options">
            <label>
                <input type="checkbox" id="caseSensitive">
                Case Sensitive
            </label>
        </div>
        
        <button class="search-button" onclick="performSearch()">Search</button>
    </div>
    
    <div class="results-container" id="results"></div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function performSearch() {
            const query = document.getElementById('searchQuery').value;
            const caseSensitive = document.getElementById('caseSensitive').checked;
            const filePattern = document.getElementById('filePattern').value;
            
            vscode.postMessage({
                command: 'search',
                query: query,
                caseSensitive: caseSensitive,
                filePattern: filePattern
            });
        }
        
        // Handle Enter key in search input
        document.getElementById('searchQuery').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        document.getElementById('filePattern').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'searchResults':
                    document.getElementById('results').innerHTML = message.results;
                    
                    // Add click handlers to match lines
                    document.querySelectorAll('.match-line').forEach(line => {
                        line.addEventListener('click', () => {
                            const file = line.getAttribute('data-file');
                            const lineNumber = parseInt(line.getAttribute('data-line'));
                            vscode.postMessage({
                                command: 'openFile',
                                file: file,
                                line: lineNumber
                            });
                        });
                    });
                    break;
            }
        });
    </script>
</body>
</html>`;
    }

    public dispose() {
        SearchPanel.currentPanel = undefined;
        this._panel.dispose();
        
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}

