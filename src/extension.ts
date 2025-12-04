import * as vscode from 'vscode';
import { SearchPanel } from './searchPanel';
import { SidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Boolean Search extension is now active!');

    // Register the sidebar webview view provider
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            SidebarProvider.viewType,
            sidebarProvider
        )
    );

    // Register the command to open sidebar
    context.subscriptions.push(
        vscode.commands.registerCommand('boolean-search.openSidebar', () => {
            vscode.commands.executeCommand('workbench.view.extension.boolean-search-sidebar');
        })
    );

    // Register the original search command (opens webview panel)
    context.subscriptions.push(
        vscode.commands.registerCommand('boolean-search.search', () => {
            SearchPanel.createOrShow();
        })
    );
}

export function deactivate() {}

