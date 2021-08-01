import _ from 'lodash';
import commonUtil from '../util/common';

function _sortDesctructuredItems(statement) {
  const destructuredStartIndex = statement.indexOf('{') + 1;
  if (destructuredStartIndex === 0) {
    return statement;
  }

  const destructuredEndIndex = statement.lastIndexOf('}');
  const firstPart = statement.substring(0, destructuredStartIndex);
  const desctructuredContent = statement.substring(destructuredStartIndex, destructuredEndIndex);
  const lastPart = statement.substring(destructuredEndIndex, statement.length);

  const sortedDestructuredContent = _.chain(desctructuredContent).split(', ').sortBy(_.toLower).join(', ').value();
  return `${firstPart}${sortedDestructuredContent}${lastPart}`;
}

function _sortImportsByName(statement) {
  return _.chain(statement).toLower().replace(/[{}]/g, '').value();
}

function _convertImportsToContent(statements, isStartWithNewline) {
  if (_.isEmpty(statements)) {
    return '';
  }

  const initialContent = isStartWithNewline ? '\n' : '';
  return statements.reduce((accumulator, statement) => `${accumulator}${statement}\n`, initialContent);
}

function _sortNodeImports(content) {
  const allImportStatements = _.chain(content).replace(/\r?\n|\r/g, '\n').replace(/\n{2,}/g, '\n').split('\n').value();

  const lodashImport = _.find(allImportStatements, _isLodashImport);
  const externalImports = _.chain(allImportStatements).filter(_isExternalImport).map(_sortDesctructuredItems).sortBy(_sortImportsByName).unshift(lodashImport || []).value();
  const dcpsImports = _.chain(allImportStatements).filter(_isDcpsImport).map(_sortDesctructuredItems).sortBy(_sortImportsByName).value();
  const localImports = _.chain(allImportStatements).filter(_isLocalImport).map(_sortDesctructuredItems).sortBy(_sortImportsByName).value();
  const constants = _.chain(allImportStatements).filter(_isConstant).map(_sortDesctructuredItems).sortBy(_sortImportsByName).value();

  const sortedContent =
    _convertImportsToContent(externalImports, false) +
    _convertImportsToContent(dcpsImports, true) +
    _convertImportsToContent(localImports, true) +
    _convertImportsToContent(constants, true);

  return sortedContent.trim();
}

const _isConstant = statement => !statement.includes('= require(');
const _isLocalImport = statement => statement.includes('= require(\'\.');
const _isDcpsImport = statement => statement.includes('= require(\'dcps-');
const _isLodashImport = statement => statement.includes('= require(\'lodash\'');
const _isExternalImport = statement => (!_isConstant(statement) && !_isLocalImport(statement) && !_isDcpsImport(statement) && !_isLodashImport(statement));

export default {
  /**
   * Sort any selected import statements.
   */
  createSortImports() {
    return () => commonUtil.translate('Sorting imports...', _sortNodeImports);
  },

  /**
   * Convert any selected text to lower case.
   * To enable...
   * 1. Add to top of file:
   *    - import { Logger } from 'coc.nvim';
   * 2. Add activate() in index.ts:
   *    - const logger: Logger = context.logger;
   *    - commands.registerCommand('formatter.makeLowerCase', importUtil.createMakeLowerCase(logger))
   *
   * createMakeLowerCase(logger: Logger) {
   *   return () => commonUtil.translate('Making Lower Case...', _.toLower, logger);
   * },
   */
}
