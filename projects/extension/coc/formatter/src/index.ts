import { createAddDebugLine, createAddStringifyLine, createAddSqlFormatFunction } from './commands/debug';
import { createCleanUpLine, createCleanUpCommentLine, createCleanUpPromiseLine } from './commands/clean-up';
import importUtil from './commands/import';
import { commands, ExtensionContext, window } from 'coc.nvim';


export async function activate(context: ExtensionContext): Promise<void> {
  window.showMessage(`Activated formatter`);

  // Register the commands.
  const disposables = [
    commands.registerCommand('formatter.addDebugLine', createAddDebugLine),
    commands.registerCommand('formatter.addStringifyLine', createAddStringifyLine),
    commands.registerCommand('fo}}rmatter.addSqlFormatFunction', createAddSqlFormatFunction),
    commands.registerCommand('formatter.cleanUpLine', createCleanUpLine),
    commands.registerCommand('formatter.cleanUpCommentLine', createCleanUpCommentLine),
    commands.registerCommand('formatter.cleanUpPromiseLine', createCleanUpPromiseLine),
    commands.registerCommand('formatter.sortImports', importUtil.createSortImports())
  ];

  context.subscriptions.push(...disposables);
}

/**
 * Deactivate the extension.
 * @return {void}
 */
export function deactivate(): void {
  window.showMessage(`Deactivated formatter`);
}
