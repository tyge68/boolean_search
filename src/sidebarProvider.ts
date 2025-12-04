import * as vscode from 'vscode';
import { parseQuery, searchWithBoolean, SearchResult, SearchMode } from './search';

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'booleanSearchView';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'search':
                        await this.performSearch(
                            message.query,
                            message.caseSensitive,
                            message.filePattern,
                            message.searchMode
                        );
                        break;
                    case 'openFile':
                        await this.openFile(message.file, message.line);
                        break;
                }
            }
        );
    }

    private async performSearch(query: string, caseSensitive: boolean, filePattern: string, searchMode: SearchMode = 'file') {
        if (!query) {
            this._view?.webview.postMessage({
                command: 'searchResults',
                results: '<div class="no-results">Please enter a search query.</div>'
            });
            return;
        }

        // Show loading state
        this._view?.webview.postMessage({
            command: 'searchResults',
            results: '<div class="loading">Searching...</div>'
        });

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                this._view?.webview.postMessage({
                    command: 'searchResults',
                    results: '<div class="error">No workspace folder opened.</div>'
                });
                return;
            }

            const parsedQuery = parseQuery(query);
            const results = await searchWithBoolean(
                workspaceFolders[0].uri.fsPath,
                parsedQuery,
                caseSensitive,
                filePattern || '**/*',
                '**/node_modules/**',
                searchMode
            );

            this._view?.webview.postMessage({
                command: 'searchResults',
                results: this.formatResultsAsHtml(results, query)
            });
        } catch (error) {
            this._view?.webview.postMessage({
                command: 'searchResults',
                results: `<div class="error">Error: ${error}</div>`
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

    private formatResultsAsHtml(results: SearchResult[], query: string): string {
        if (results.length === 0) {
            return `<div class="no-results">No results found for "${this.escapeHtml(query)}".</div>`;
        }

        let html = `<div class="results-header">${results.length} file(s) with matches for "${this.escapeHtml(query)}"</div>`;

        for (const result of results) {
            const relativePath = vscode.workspace.asRelativePath(result.file);
            html += '<div class="file-result">';
            html += `<div class="file-name">${this.escapeHtml(relativePath)} (${result.matches.length} matches)</div>`;

            for (const match of result.matches) {
                html += `<div class="match-line" onclick="openFile('${this.escapeHtml(result.file)}', ${match.line})">`;
                html += `<span class="line-number">${match.line}</span>`;
                html += `<span class="line-content">${this.escapeHtml(match.content.trim())}</span>`;
                html += '</div>';
            }

            html += '</div>';
        }

        return html;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boolean Search</title>
    <style>
        body {
            padding: 10px;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
        }
        
        .input-group {
            margin-bottom: 12px;
        }
        
        label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 12px;
            color: var(--vscode-foreground);
        }
        
        input[type="text"] {
            width: 100%;
            padding: 6px 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            font-family: var(--vscode-font-family);
            font-size: 13px;
            box-sizing: border-box;
        }
        
        input[type="text"]:focus {
            outline: 1px solid var(--vscode-focusBorder);
            border-color: var(--vscode-focusBorder);
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        input[type="checkbox"] {
            margin-right: 8px;
        }
        
        button {
            width: 100%;
            padding: 8px 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-family: var(--vscode-font-family);
            font-size: 13px;
            font-weight: 500;
        }
        
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        button:active {
            opacity: 0.8;
        }
        
        .results-container {
            margin-top: 16px;
            border-top: 1px solid var(--vscode-panel-border);
            padding-top: 16px;
        }
        
        .results-header {
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--vscode-foreground);
        }
        
        .file-result {
            margin-bottom: 16px;
        }
        
        .file-name {
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--vscode-textLink-foreground);
            font-size: 13px;
        }
        
        .match-line {
            display: flex;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 2px;
            font-size: 12px;
            line-height: 18px;
        }
        
        .match-line:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .line-number {
            color: var(--vscode-editorLineNumber-foreground);
            margin-right: 12px;
            min-width: 40px;
            text-align: right;
            flex-shrink: 0;
        }
        
        .line-content {
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-editor-font-family);
            white-space: pre-wrap;
            word-break: break-all;
        }
        
        .no-results, .loading, .error {
            padding: 12px;
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }
        
        .error {
            color: var(--vscode-errorForeground);
        }
        
        .help-text {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="input-group">
        <label for="searchQuery">Search Query</label>
        <input type="text" id="searchQuery" placeholder="e.g., function AND export">
        <div class="help-text">Use AND, OR, NOT operators</div>
    </div>
    
    <div class="input-group">
        <label for="filePattern">File Pattern (optional)</label>
        <input type="text" id="filePattern" placeholder="e.g., **/*.ts">
        <div class="help-text">Leave empty to search all files</div>
    </div>
    
    <div class="checkbox-group">
        <input type="checkbox" id="caseSensitive">
        <label for="caseSensitive">Case Sensitive</label>
    </div>
    
    <div class="input-group">
        <label>Search Mode</label>
        <div style="display: flex; gap: 12px; margin-top: 4px;">
            <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;">
                <input type="radio" name="searchMode" value="file" checked>
                Same File
            </label>
            <label style="display: flex; align-items: center; gap: 4px; font-weight: normal;">
                <input type="radio" name="searchMode" value="line">
                Same Line
            </label>
        </div>
        <div class="help-text">Same File: terms anywhere in file. Same Line: all terms on same line.</div>
    </div>
    
    <button id="searchBtn">Search</button>
    
    <div class="results-container" id="results"></div>

    <script>
        const vscode = acquireVsCodeApi();
        
        const searchBtn = document.getElementById('searchBtn');
        const searchQuery = document.getElementById('searchQuery');
        const filePattern = document.getElementById('filePattern');
        const caseSensitive = document.getElementById('caseSensitive');
        const results = document.getElementById('results');
        
        // Trigger search on button click
        searchBtn.addEventListener('click', () => {
            performSearch();
        });
        
        // Trigger search on Enter key
        searchQuery.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        filePattern.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const searchMode = document.querySelector('input[name="searchMode"]:checked').value;
            vscode.postMessage({
                command: 'search',
                query: searchQuery.value,
                caseSensitive: caseSensitive.checked,
                filePattern: filePattern.value,
                searchMode: searchMode
            });
        }
        
        // Global function to open files (called from match-line clicks)
        window.openFile = function(file, line) {
            vscode.postMessage({
                command: 'openFile',
                file: file,
                line: line
            });
        };
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'searchResults':
                    results.innerHTML = message.results;
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}

