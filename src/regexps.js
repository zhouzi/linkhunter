const _wrappers = '(){}"\'';
const _punctuationMark = '.!?:,;';
const _endOfString = `(?=[${_wrappers}${_punctuationMark}]*)`;
const _startOfString = `([\\s${_wrappers}${_punctuationMark}]*)`;
const _noTrailingPuncWrap = `(?:[^\\s]*[^\\s${_wrappers}${_punctuationMark}])?`;
const _domain = '(?:[-a-z\u00C0-\u017F0-9]{1,255}\\.)+[a-z]{2,10}';
const _email = `(?:mailto:)?[^\\s${_wrappers}${_punctuationMark.substr(1)}]+@${_domain}`;
const _regularUrl = `https?:\/\/${_domain}(?:/${_noTrailingPuncWrap})?`;
const _userUrl = `${_domain}(?:/${_noTrailingPuncWrap})?`;

export const email = new RegExp(`^${_email}$`, 'i');
export const link = new RegExp(`^((?:${_email})|(?:${_regularUrl})|(?:${_userUrl}))$`, 'i');
export const links = new RegExp(`${_startOfString}((?:${_regularUrl})|(?:(?:${_email})|(?:${_userUrl}))${_endOfString})`, 'gi');
