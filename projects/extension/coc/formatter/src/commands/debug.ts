import commonUtil from '../util/common';

/**
 * Add a line of debug.
 */
export async function createAddDebugLine(): Promise<void> {
  try {
    // Get the current line details.
    const { indent, currentLineNumber } = await commonUtil.parseCurrentLine();

    // Create the debug line.
    const newLineText = `${indent}console.log('<----------------------------------------- STEP 1');\n`;

    // Insert the new text above the cursor.
    await commonUtil.insertTextAboveCurrentLine(newLineText);

    // Move the cursor to the number.
    const numberIndex = newLineText.indexOf('1');
    await commonUtil.moveCursorTo(currentLineNumber, numberIndex);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}

/**
 * Add a line to stringify data.
 */
export async function createAddStringifyLine(): Promise<void> {
  try {
    // Get the current line details.
    const { indent, currentLineNumber } = await commonUtil.parseCurrentLine();

    // Create the stringify line.
    const newLineText = `${indent}console.log(JSON.stringify(CHANGE_ME, null, 2));\n`;

    // Insert the new text above the cursor.
    await commonUtil.insertTextAboveCurrentLine(newLineText);


    // Move the cursor to the CHANGE_ME token.
    const changeMeIndex = newLineText.indexOf('CHANGE_ME');
    await commonUtil.moveCursorTo(currentLineNumber, changeMeIndex);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}

/**
 * Add a function to perform SQL formatting.
 */
export async function createAddSqlFormatFunction(): Promise<void> {
  try {
    // Get the current line details.
    const { indent } = await commonUtil.parseCurrentLine();

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
      `${indent}  // toSqlString(FULL_QUERY.toString(), 'CHANGE_ME');\n` +
      `${indent}  // npm install poor-mans-t-sql-formatter\n` +
      `${indent}}` +
      `\n`;

    // Insert the new text above the cursor.
    await commonUtil.insertTextAboveCurrentLine(newText);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}
