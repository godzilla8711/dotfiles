'use script'

const vscode = require('vscode');

/**
 * Retrieve the first matching text for a regular expression.
 * @param {string} value Value to check for a match
 * @param {RegExp} regex Regular expression
 * @return {string} First matching text, or an empty string if no match
 */
function _firstMatchingText(value, regex) {
  if (!value) {
    return '';
  }
  const matchingTextItems = value.match(regex) || [''];
  return matchingTextItems[0];
}

function isAbcModule() {
  const [workspaceName] = vscode.workspace.name.split(' ');
  // vscode.window.showInformationMessage(workspaceName);
  if (workspaceName === 'module-abc') {
    return true;
  }

  return false;
}

/**
 * Clean up a line of JSDoc comment.
 */
async function cleanUpJsDocComment() {
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
    const indent = _firstMatchingText(fullLineText, /^ +/);
    let content = _firstMatchingText(fullLineText, /[^ ].*/);

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

    content = content.replace(/{.*} knex.*/, '{object} knex Database connection');

    if (isAbcModule()) {
      content = content.replace(/{.*} dbConfig.*/, '{common.DbConfig} dbConfig Database configuration');
      content = content.replace(/{.*} requestContext.*/, '{common.RequestContext} requestContext Request context');
      content = content.replace(/{.*} reqContext.*/, '{common.RequestContext} reqContext Request context');
    } else {
      content = content.replace(/{.*} dbConfig.*/, '{object} dbConfig Database configuration');
      content = content.replace(/{.*} requestContext.*/, '{object} requestContext Request context');
      content = content.replace(/{.*} reqContext.*/, '{object} reqContext Request context');
    }

    content = content.replace(/{.*} dcpsCaseUid.*/, '{number} dcpsCaseUid Case ID');
    content = content.replace(/{.*} requestTypeCode .*/, '{string} requestTypeCode Request type code');
    content = content.replace(/{.*} requestType .*/, '{string} requestType Request type code');

    content = content.replace(/(param|returns|return) .* cb .*/, 'return {Promise<object>} Letter processing result');
    content = content.replace(/^$/, '* @return {Promise<object>} Letter processing result');

    // Prepend the original indentation.
    const newLineText = indent + content;

    // Replace the line  with the new text.
    await editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newLineText);
    })

    // Move down one line.
    // await vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

/**
 * Add a line of debug.
 */
async function addDebugLine() {
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
    const indent = _firstMatchingText(fullLineText, /^ +/);

    // Create the debug line.
    const newLineText =
      `${indent}console.log('<--------------------------------------------------------------- STEP 1');\n${fullLineText}`;

    // Replace the line with the new text.
    await editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newLineText);
    })

    // Move down one line.
    // await vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

/**
 * Add a line to stringify data.
 */
async function addStringifyLine() {
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
    const indent = _firstMatchingText(fullLineText, /^ +/);

    // Create the stringify line.
    const newLineText =
      `${indent}console.log(JSON.stringify(CHANGE_ME, null, 2));\n${fullLineText}`;

    // Replace the line with the new text.
    await editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newLineText);
    })

    // Move down one line.
    // await vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

/**
 * Add SQL formatter snippet.
 */
 async function addSqlFormatter() {
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
    const indent = _firstMatchingText(fullLineText, /^ +/);

    // Create the stringify line.
    const newText =
      `\n${indent}function toSqlString(value, header) {\n` +
      `${indent}  let sql = require(\'poor-mans-t-sql-formatter\').formatSql(\n` +
      `${indent}    value, {indent: '  ', spacesPerTab: 2, clauseBreaks: 0, expandCommaList: false}).text;\n\n` +
      `${indent}  console.log(\`\\n--------------------------- START: \$\{header\}\`);\n\n` +
      `${indent}  sql = sql.replace(/,\\n  (.*),\\n/g, ', $1,\\n');\n` +
      `${indent}  sql = sql.replace(/,\\n  (.*),\\n/g, ', $1,\\n');\n` +
      `${indent}  sql = sql.replace(/\\n  AND/g, '\\nAND');\n` +
      `${indent}  sql = sql.replace(/\\nLEFT (.*)\\nAND/g, '\\nLEFT $1 AND');\n` +
      `${indent}  sql = sql.replace(/\\nINNER (.*)\\nAND/g, '\\nINNER $1 AND');\n` +
      `${indent}  sql = sql.replace(/\\n$/g, ';');\n\n` +
      `${indent}  console.log(sql);\n` +
      `${indent}  console.log('--------------------------- END\\n');\n` +
      `${indent}}\n` +
      `${fullLineText}`;

    // Replace the line with the new text.
    await editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, newText);
    })

    // Move down one line.
    // await vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}


module.exports = {
  cleanUpJsDocComment,
  addDebugLine,
  addStringifyLine,
  addSqlFormatter
}
