'use script'

const vscode = require('vscode');

const formatterUtil = require('./util/formatter-util');
const importUtil = require('./util/import-util');
const promiseUtil = require('./util/promise-util');

/**
 * Activate the extension.
 * @param {vscode.ExtensionContext} context  Extension context
 * @return {void}
 */
function activate(context) {
  console.log('Activated Formatter');

  // Register the commands.
  const disposables = [
    vscode.commands.registerCommand('extension.formatterComment', formatterUtil.cleanUpJsDocComment),
    vscode.commands.registerCommand('extension.formatterSortImports', importUtil.sortImports),
    vscode.commands.registerCommand('extension.convertToAsyncAwait', promiseUtil.convertToAsyncAwait),
    vscode.commands.registerCommand('extension.addDebugLine', formatterUtil.addDebugLine),
    vscode.commands.registerCommand('extension.addStringifyLine', formatterUtil.addStringifyLine),
    vscode.commands.registerCommand('extension.addSqlFormatter', formatterUtil.addSqlFormatter),
    vscode.commands.registerCommand('extension.formatterLower', importUtil.makeLowerCase),
    vscode.commands.registerCommand('extension.formatterUpper', importUtil.makeUpperCase)
  ];

  context.subscriptions.push(...disposables)
}

/**
 * Deactivate the extension.
 * @return {void}
 */
function deactivate() {
  console.log('Deactivated Formatter');
}

module.exports = {
	activate,
	deactivate
}
