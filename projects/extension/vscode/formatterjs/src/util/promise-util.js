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

function handleCallback(indent, content) {
  let errIndex = content.indexOf('(err, ');
  if (errIndex === -1) {
    errIndex = content.indexOf(', err => ');
  }

  if (errIndex === -1) {
    return content;
  }

  const resultNameStartIndex = errIndex + 6;
  const resultNameEndIndex = resultNameStartIndex + content.substring(resultNameStartIndex).indexOf(')');
  const resultName = content.substring(resultNameStartIndex, resultNameEndIndex);
  content = content.replace(/, \(err, .*/, ');')
  content = content.replace(/, err => .*/, ');')
  content = content.replace(/util.callbackify\(/, '')
  content = content.replace(/callbackify\(/, '')
  content = content.replace(/\)/, '');
  return `${indent}const ${resultName} = await ${content.substring(indent.length)}`;
}

/**
 * Conver to async/await
 */
async function convertToAsyncAwait() {
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
    // let content = _firstMatchingText(fullLineText, /[^ ].*/);
    let content = fullLineText;

    // Edit the line.
    content = handleCallback(indent, content);
    content = content.replace(/done =>/, 'async() =>');

    content = content.replace(/ request\(/, ' const {body: result, status} = await request(');
    content = content.replace(/ request$/, ' const {body: result, status} = await request');
    content = content.replace(/\.expect\(200\)/, 'expect(status).to.equal(200);');
    content = content.replace(/\.expect\(404\)/, 'expect(status).to.equal(404);');
    content = content.replace(/\.expect\(500\)/, 'expect(status).to.equal(500);');
    content = content.replace(/\.expect\(\'Content-Type\'.*/, '')
    content = content.replace(/  \.end\(done\).*/, '  ');

    content = content.replace(/expect\(err\).not.to.exist;/, '');
    content = content.replace(/expect\(err\).to.not.exist;/, '');
    content = content.replace(/expect\(err\).to.exist;/, 'expect(error).to.exist;');
    content = content.replace(/expect\(err\).to.be.null;/, '');
    content = content.replace(/expect\(err\).to.not.be.null;/, 'expect(error).not.to.be.null;');
    content = content.replace(/expect\(err\).not.to.be.null;/, 'expect(error).not.to.be.null;');
    content = content.replace(/expect\(err\).to.be.an\('error'\);/, 'expect(error).to.be.an(\'error\');');
    content = content.replace(/expect\(err\).to.be.null;/, '');
    content = content.replace(/expect\(result\).to.not.exist;/, '');
    content = content.replace(/expect\(result\).not.to.exist;/, '');
    content = content.replace(/ done\(\);/, ' ');
    content = content.replace(/ knex\(/, ' await knex(');
    content = content.replace(/ knex\./, ' await knex.');
    content = content.replace(/ knex$/, ' await knex');
    content = content.replace(/\.asCallback\(done\)?;/, '');

    content = content.replace(/  expect\(/, 'expect(');
    content = content.replace(/\.expect\(resp => \{/, '');
    content = content.replace(/const result = resp\.body;/, '');
    content = content.replace(/resp\.body/, 'result');
    content = content.replace(/  \}\)?;$/, '  ');

    if (content.includes('  .set(') || content.includes('  .send(') || content.includes('  .returning(')) {
      content += ';'
    }

    // content = content.replace(/(param|returns|return) .* cb .*/, 'return {Promise<object>} Letter processing result');
    // vscode.window.showInformationMessage('Converting Line...');

    // Prepend the original indentation.
    // const newLineText = indent + content;
    let newLineText = content;

    // Replace the line  with the new text.
    let isDeletedLine = false;
    await editor.edit(editBuilder => {
      if (newLineText && newLineText === indent) {
        // No meaningful content so delete the line.
        editBuilder.delete(currentLine.rangeIncludingLineBreak);
        isDeletedLine = true;
      } else if (newLineText === fullLineText) {
        // Content has not been modified so just left shift.
        editBuilder.replace(currentLine.range, newLineText.substring(2));
      } else {
        // Content has been modified.
        if (content.includes('expect(status).to.equal')) {
          newLineText = '\n' + newLineText;
        }
        editBuilder.replace(currentLine.range, newLineText);
      }
    });

    // Move down one line.
    if (!isDeletedLine) {
      await vscode.commands.executeCommand('cursorMove', {to: 'down', by: 'line'}); // Thenable
      await vscode.commands.executeCommand('editorScroll', {to: 'down', by: 'line'}); // Thenable
    }

  } catch (err) {
    const {message} = err;
    vscode.window.showInformationMessage(message);
    console.error(message);
  }
}

module.exports = {
  convertToAsyncAwait
}
