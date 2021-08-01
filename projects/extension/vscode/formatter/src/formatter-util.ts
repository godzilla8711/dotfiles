import * as _ from 'lodash';
import * as vscode from 'vscode';

function firstMatchingText(value: string, regex: RegExp) {
  if (!value) {
    return '';
  }
  const matchingTextItems = value.match(regex) || [''];
  return matchingTextItems[0];
}

function escape(value: string) {
  return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function translate(info: string, translator: (selectedText: string) => string) {
  try {
    if (info) {
      vscode.window.showInformationMessage(info);
    }

    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      // Get the selected text.
      const document = editor.document;
      const selection = editor.selection;
      const selectedText = document.getText(selection);

      // Translate the selection
      const convertedText = translator(selectedText);
      editor.edit(editBuilder => {
        editBuilder.replace(selection, convertedText);
      });
    }
  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

export function makeLowerCase(): void {
  translate('Making Lower Case...', selectedText => {
    return _.toLower(selectedText);
  });
}

export function makeUpperCase(): void {
  translate('Making Upper Case...', _.toUpper);
}

export function convertCommentOrig(): void {
  const commands = [
    's/^   /___/',
    's/^  /__/',
    's/ +/ /g',
    's/^___/   /',
    's/^__/  /',
    's/param {/param  {/',
    's/{N/{n/',
    's/{S/{s/',
    's/{O/{o/',
    's/{B/{b/',
    's/, cb//',
    's/, asyncCb//g',
    's/asyncCb => //g',
    's/ - / /',
    's/{.*} dbConfig.*/{common.DbConfig} dbConfig Database configuration/',
    's/{.*} .*Context.*/{common.RequestContext} requestContext Request Context/',
    's/{.*} knex.*/{object} knex Database connection/',
    's/param .* cb .*/return {Promise<object>} Letter processing result/',
    's/return .* cb .*/return {Promise<object>} Letter processing result/',
    's/returns .* cb .*/return {Promise<object>} Letter processing result/',
    's/^$/ * @return {Promise<object>} Letter processing result/',
  ];

  try {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const selection = editor.selection;

    let position;
    if (selection.isEmpty) {
      position = selection.active;
    } else {
      position = selection.anchor;
    }
    // vscode.window.showInformationMessage(`selection is empty, line = ${position.line} column = ${position.character}`);

    const currentLine = document.lineAt(position.line);
    let newLineText = currentLine.text;;
    for (const command of commands) {
      const tokens = command.split('/');
      if (tokens.length !== 4) {
        throw new Error(`Invalid command: ${command}`);
      }
      const [, matchPattern, replacement, flag] = tokens;
      let regex;
      if (flag) {
        regex = new RegExp(matchPattern, flag);
      } else {
        regex = new RegExp(matchPattern);
      }
      newLineText = newLineText.replace(regex, replacement);
    }

    editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newLineText);
    })

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

export function convertComment(): void {
  try {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the full text of the line that currently has cursor focus
    const document = editor.document;
    const selection = editor.selection;
    let position;
    if (selection.isEmpty) {
      position = selection.active;
    } else {
      position = selection.anchor;
    }
    const currentLine = document.lineAt(position.line);
    const fullLineText = currentLine.text;

    // Extract the indentation.
    const indent = firstMatchingText(fullLineText, /^ +/);
    let content = firstMatchingText(fullLineText, /[^ ].*/);

    // Edit the line.
    content = content.replace(/ +/g, ' ');
    content = content.replace(/param {/, 'param  {');
    content = content.replace(/ - /, ' ');

    content = content.replace(/{Number/, '{number');
    content = content.replace(/{[Ii]nteger/, '{number');
    content = content.replace(/{String/, '{string');
    content = content.replace(/{Object/, '{object');
    content = content.replace(/{Boolean/, '{boolean');

    content = content.replace(/, cb/, '');
    content = content.replace(/, asyncCb/, '');
    content = content.replace(/asyncCb => /, '');
    content = content.replace(/, \(err, .*/, ');');

    content = content.replace(/{.*} dbConfig.*/, '{common.DbConfig} dbConfig Database configuration');
    content = content.replace(/{.*} knex.*/, '{object} knex Database connection');
    content = content.replace(/{.*} requestContext.*/, '{common.RequestContext} requestContext Request context');
    content = content.replace(/{.*} reqContext.*/, '{common.RequestContext} reqContext Request context');

    content = content.replace(/(param|returns|return) .* cb .*/, 'return {Promise<object>} Letter processing result');
    content = content.replace(/^$/, '* @return {Promise<object>} Letter processing result');

    // Prepend the original indentation.
    const newLineText = indent + content;

    // Replace the line  with the new text.
    editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newLineText);
    })

    // Move down one line.
    // vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}
