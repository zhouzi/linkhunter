import { links } from './regexps';
import defaultLinkifyCallback from './defaultLinkifyCallback';

export default (str, callback = defaultLinkifyCallback) => (
  str.replace(links, (match, precedingCharacter, link) => precedingCharacter + callback(link))
);
