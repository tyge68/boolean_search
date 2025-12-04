import * as vscode from 'vscode';
import { SearchPanel } from './searchPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Boolean Search extension is now active!');

    // Register the search command
    let disposable = vscode.commands.registerCommand('boolean-search.search', () => {
        SearchPanel.createOrShow();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

