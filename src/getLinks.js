import { links } from './regexps';

export default str => {
  const results = [];

  let result;
  while (result = links.exec(str)) {// eslint-disable-line no-cond-assign
    results.push(result[2]);
  }

  return results;
};
