import { Document, window, workspace, Range, Logger } from 'coc.nvim';

/**
 * Retrieve the first matching text for a regular expression.
 * @param {string} value Value to check for a match
 * @param {RegExp} regex Regular expression
 * @return {string} First matching text, or an empty string if no match
 */
function firstMatchingText(value: string, regex: RegExp): string {
  if (!value) {
    return '';
  }
  const matchingTextItems = value.match(regex) || [''];
  return matchingTextItems[0];
}

async function getCurrentLine(document: Document): Promise<{currentLineText: string, currentLineNumber: number}> {
  if (!document) {
    return {
      currentLineText: '',
      currentLineNumber: -1
    };
  }

  // Get the full text of the line that currently has cursor focus
  const { line: currentLineNumber } = await window.getCursorPosition();
  const currentLineText = document.getline(currentLineNumber);

  return {
    currentLineNumber,
    currentLineText
  };
}

async function parseCurrentLine() {
  const document = await workspace.document;
  const {currentLineText, currentLineNumber} = await getCurrentLine(document);

  // Extract the indentation.
  const indent = firstMatchingText(currentLineText, /^ +/);
  const content = firstMatchingText(currentLineText, /[^ ].*/);

  return  {indent, content, currentLineText, currentLineNumber, document};
}

/**
 * Get the selected text for visual mode. Note that this does not work for normal mode.
 * @param document Document
 * @returns Selected text and selecte range
 */
async function getSelectedText(document: Document): Promise<{selectedText: string, selectedRange?: Range}> {
  if (!document) {
    return { selectedText: '' };
  }

  // Get the selected text.
  const selectedRange = await workspace.getSelectedRange('v', document);
  if (!selectedRange) {
    return { selectedText: '' };
  }

  const selectedText = document.textDocument.getText(selectedRange) || '';
  return { selectedText, selectedRange };
}

async function insertTextAboveCurrentLine(newLineText: string, document: Document | null = null): Promise<void> {
  // Add a new line of text above the cursor.
  document = document || await workspace.document;
  const { line: currentLineNumber } = await window.getCursorPosition();
  return document.applyEdits([
    {
      range: {
        // Same values for start/end so that text is inserted.
        start: { line: currentLineNumber, character: 0 },
        end: { line: currentLineNumber, character: 0 }
      },
      newText: newLineText
    }
  ]);
}

async function replaceCurrentLine(newText: string, document: Document | null = null): Promise<void> {
  // Replace the current line of text based on cursor position.
  document = document || await workspace.document;
  const { line: currentLineNumber } = await window.getCursorPosition();
  return document.changeLines([
    [ currentLineNumber, newText ]
  ]);
}

/**
 * Translate any selected text using the provided translator function.
 * @param infoMessage Optional info message text
 * @param translator Translator function
 */
async function translate(
  infoMessage: string,
  translator: (selectedText: string) => string
): Promise<void> {
  try {
    if (infoMessage) {
      await window.showInformationMessage(infoMessage);
    }

    // Get the selected text.
    const document = await workspace.document;
    const {selectedText, selectedRange} = await getSelectedText(document);
    if (!selectedText || !selectedRange) {
      await window.showWarningMessage('No selected text was found');
      return;
    }

    // Translate the selection
    const convertedText = translator(selectedText);
    await document.applyEdits([{ range: selectedRange, newText: convertedText }]);

  } catch (err) {
    return await handleError(err);
  }
}

async function moveCursorTo(targetLineNumber: number, targetCharIndex: number) : Promise<void> {
  await window.moveTo({ line: targetLineNumber, character: targetCharIndex });
}

async function log(message: string) {
  await window.echoLines([message], true);
  // window.showMessage('step 3');
}

async function handleError(err: Error, logger?: Logger): Promise<void> {
  const {message} = err;
  window.showMessage(message);

  if (logger) {
    logger.error(message);
  } else {
    await window.echoLines([message], true);
  }
}

export default {
  // Text retrieval
  firstMatchingText,
  getCurrentLine,
  parseCurrentLine,
  getSelectedText,

  // Text update
  insertTextAboveCurrentLine,
  replaceCurrentLine,
  translate,

  // Misc
  moveCursorTo,
  log,

  // Error handling
  handleError
};
