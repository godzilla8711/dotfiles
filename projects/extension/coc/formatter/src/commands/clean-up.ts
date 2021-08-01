
import _ from 'lodash';
import { workspace } from 'coc.nvim';
import commonUtil from '../util/common';

function isAbcModule() {
  const workspaceName = _.get(workspace, 'workspaceFolder.name');
  commonUtil.log(workspaceName);
  if (workspaceName === 'module-abc') {
    return true;
  }

  return false;
}

export async function createCleanUpCommentLine() {
  try {
    let {indent, content} = await commonUtil.parseCurrentLine();

    // Edit the line.
    content = content.replace(/ +/g, ' ');
    content = content.replace(/param {/, 'param  {');
    content = content.replace(/ - /, ' ');

    content = content.replace(/{Number/, '{number');
    content = content.replace(/{[Ii]nteger/, '{number');
    content = content.replace(/{String/, '{string');
    content = content.replace(/{Object/, '{object');
    content = content.replace(/{Boolean/, '{boolean');

    content = content.replace(/{.*} knex.*/, '{object} knex Database connection');
    content = content.replace(/{.*} dcpsCaseUid.*/, '{number} dcpsCaseUid Case ID');
    content = content.replace(/{.*} requestTypeCode .*/, '{string} requestTypeCode Request type code');
    content = content.replace(/{.*} requestType .*/, '{string} requestType Request type code');

    content = content.replace(/(param|returns|return) .* cb .*/, 'return {Promise<object>} Letter processing result');
    content = content.replace(/^$/, '* @return {Promise<object>} Letter processing result');

    if (isAbcModule()) {
      content = content.replace(/{.*} dbConfig.*/, '{common.DbConfig} dbConfig Database configuration');
      content = content.replace(/{.*} requestContext.*/, '{common.RequestContext} requestContext Request context');
      content = content.replace(/{.*} reqContext.*/, '{common.RequestContext} reqContext Request context');
    } else {
      content = content.replace(/{.*} dbConfig.*/, '{object} dbConfig Database configuration');
      content = content.replace(/{.*} requestContext.*/, '{object} requestContext Request context');
      content = content.replace(/{.*} reqContext.*/, '{object} reqContext Request context');
    }

    // Replace the current line with the new text.
    const newLineText = indent + content;
    await commonUtil.replaceCurrentLine(newLineText);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}

export async function createCleanUpPromiseLine() {
  try {
    let {indent, content} = await commonUtil.parseCurrentLine();

    content = content.replace(/, cb/, '');
    content = content.replace(/, asyncCb/, '');
    content = content.replace(/asyncCb => /, '');
    content = content.replace(/, \(err, .*/, ');');

    // Replace the current line with the new text.
    const newLineText = indent + content;
    await commonUtil.replaceCurrentLine(newLineText);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}

/**
 * Perform clean up on a single line.
 */
export async function createCleanUpLine() {
  try {
    let {indent, content} = await commonUtil.parseCurrentLine();

    const snapshot = content;
    content = content.replace(/^it.only\(/, 'it\(');
    content = content.replace(/^describe.only\(/, 'describe\(');
    if (content === snapshot) {
      // This conditional avoids undoing the removal of ".only"
      content = content.replace(/^it\(/, 'it.only\(');
      content = content.replace(/^describe\(/, 'describe.only\(');
    }

    // Replace the current line with the new text.
    const newLineText = indent + content;
    await commonUtil.replaceCurrentLine(newLineText);

  } catch (err) {
    return await commonUtil.handleError(err);
  }
}
