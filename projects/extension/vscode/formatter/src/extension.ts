import * as vscode from 'vscode';
import * as formatterUtil from './formatter-util';

  // Activate the extension.
  export function activate(context: vscode.ExtensionContext): void {
    console.log('Activated Formatter');

    // Register the commands.
    const disposables = [
      vscode.commands.registerCommand('extension.formatterComment', formatterUtil.convertComment),
      vscode.commands.registerCommand('extension.formatterLower', formatterUtil.makeLowerCase),
      vscode.commands.registerCommand('extension.formatterUpper', formatterUtil.makeUpperCase)
    ];

    context.subscriptions.push(...disposables);
  }

  // Deactivate the extension.
  export function deactivate(): void {
  console.log('Deactivated Formatter');
}
