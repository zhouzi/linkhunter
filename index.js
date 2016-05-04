/* global module, define, exports */

/*!
 * linkhunter - v4.0.0
 * Detect links that real users actually type.
 * https://github.com/Zhouzi/linkhunter
 *
 * @author Gabin Aureche
 * @license MIT
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    exports.linkhunter = factory();
  } else {
    root.linkhunter = factory();
  }
})(this, function () {
  var WRAPPERS = '(){}"\'';
  var PUNCTUATION_MARK = '.!?:,;';
  var ENDOFSTRING_REGEXP = '(?=[' + WRAPPERS + PUNCTUATION_MARK + ']*)';
  var STARTOFSTRING_REGEXP = '([\\s' + WRAPPERS + PUNCTUATION_MARK + ']*)';
  var NOTRAILING_PUNC_WRAP = '(?:[^\\s]*[^\\s' + WRAPPERS + PUNCTUATION_MARK + '])?';
  var DOMAIN_REGEXP = '(?:[-a-z0-9]{1,255}\\.)+[a-z]{2,10}';
  var EMAIL_REGEXP = '(?:mailto:)?[^\\s' + WRAPPERS + PUNCTUATION_MARK.substr(1) + ']+@' + DOMAIN_REGEXP;
  var REGULARURL_REGEXP = 'https?:\/\/' + DOMAIN_REGEXP + '(?:/' + NOTRAILING_PUNC_WRAP + ')?';
  var USERURL_REGEXP = DOMAIN_REGEXP + '(?:/' + NOTRAILING_PUNC_WRAP + ')?';

  var regexps = {
    email: new RegExp('^' + EMAIL_REGEXP + '$', 'i'),
    regularUrl: new RegExp('^' + REGULARURL_REGEXP, 'i'),
    userUrl: new RegExp('^' + USERURL_REGEXP, 'i'),
    link: new RegExp('^((?:' + EMAIL_REGEXP + ')|(?:' + REGULARURL_REGEXP + ')|(?:' + USERURL_REGEXP + '))$', 'i'),
    links: new RegExp(
        STARTOFSTRING_REGEXP +
        '((?:' +
        REGULARURL_REGEXP +
        ')|(?:(?:' +
        EMAIL_REGEXP +
        ')|(?:' +
        USERURL_REGEXP +
        '))' +
        ENDOFSTRING_REGEXP +
        ')',
        'gi'
      )
  };

  function merge (dest, src) {
    for (var key in src) {
      if (!src.hasOwnProperty(key)) {
        continue;
      }

      dest[key] = src[key];
    }

    return dest;
  }

  function looksLikeAnEmail (str) {
    return regexps.email.test(str);
  }

  function looksLikeALink (str, includeEmail) {
    if (includeEmail == null) {
      includeEmail = false;
    }

    if (!includeEmail && looksLikeAnEmail(str)) {
      return false;
    }

    return regexps.link.test(str);
  }

  function getLinks (str, includeEmail) {
    if (includeEmail == null) {
      includeEmail = false;
    }

    var links = [];

    var result;
    while (result = regexps.links.exec(str)) { // eslint-disable-line no-cond-assign
      links.push(result[2]);
    }

    if (!includeEmail) {
      return links.filter(function (link) {
        return !looksLikeAnEmail(link);
      });
    }

    return links;
  }

  function replaceLinks (str, callback) {
    return str.replace(regexps.links, function (match, precedingCharacter, link) {
      return precedingCharacter + callback(link);
    });
  }

  function linky (str, options) {
    if (options == null) {
      options = {};
    }

    var defaults = {
      ignoreEmail: false,
      target: null,
      protocol: 'http://',
      displayValue: merge(
        {
          cleanUp: false,
          beautify: false,
          shorten: false
        },
        options.displayValue || {}
      )
    };

    options = merge(defaults, options);

    var linkTemplate =
        options.target
          ? '<a href="{{formatted}}" target="' + options.target + '">{{displayValue}}</a>'
          : '<a href="{{formatted}}">{{displayValue}}</a>'
      ;

    var isEmail;
    var displayValue;
    return replaceLinks(str, function (link) {
      isEmail = looksLikeAnEmail(link);

      if (options.ignoreEmail && isEmail) {
        return link;
      }

      displayValue = link;

      if (options.displayValue.cleanUp) {
        displayValue = cleanUp(displayValue);
      }

      if (options.displayValue.beautify) {
        displayValue = beautify(displayValue);
      }

      if (options.displayValue.shorten) {
        displayValue = shorten(displayValue, options.displayValue.shorten);
      }

      if (options.displayValue.withProtocol) {
        displayValue = withProtocol(displayValue, options.protocol);
      }

      if (isEmail) {
        return '<a href="' + withProtocol(link) + '">' + displayValue + '</a>';
      }

      return linkTemplate
        .replace('{{formatted}}', withProtocol(link, options.protocol))
        .replace('{{displayValue}}', displayValue)
        ;
    });
  }

  function hasProtocol (link) {
    if (looksLikeAnEmail(link)) {
      return /^mailto:/i.test(link);
    }

    return /^https?:\/\//i.test(link);
  }

  function withProtocol (link, protocol) {
    if (protocol == null) {
      protocol = 'http://';
    }

    if (looksLikeAnEmail(link)) {
      protocol = 'mailto:';
    }

    return hasProtocol(link) ? link : protocol + link;
  }

  function cleanUp (link, removeQueryParams) {
    if (removeQueryParams == null) {
      removeQueryParams = false;
    }

    if (removeQueryParams) {
      var indexOfQueryParams = link.lastIndexOf('?');

      if (indexOfQueryParams >= 0) {
        link = link.substr(0, indexOfQueryParams);
      }
    }

    link = link.replace(/^https?:\/\//i, '').replace(/\/#?$/, '');
    return link;
  }

  function shorten (link, maxLength) {
    if (maxLength == null) {
      return link;
    }

    if (link.length <= maxLength) {
      return link;
    }

    var ellipsis = '...';
    return link.substr(0, maxLength - ellipsis.length) + ellipsis;
  }

  function beautify (link, removeQueryParams) {
    if (removeQueryParams == null) {
      removeQueryParams = true;
    }

    if (looksLikeAnEmail(link)) {
      return link;
    }

    link = cleanUp(link, removeQueryParams);

    // if there is no sub path e.g. site.com
    if (link.indexOf('/') < 0) {
      return link;
    }

    var fragments = link.split('/');

    if (fragments.length > 2) {
      return fragments.shift() + '/.../' + fragments.pop();
    }

    return fragments.shift() + '/' + fragments.pop();
  }

  return {
    regexps: regexps,
    looksLikeAnEmail: looksLikeAnEmail,
    looksLikeALink: looksLikeALink,
    getLinks: getLinks,
    replaceLinks: replaceLinks,
    linky: linky,
    hasProtocol: hasProtocol,
    withProtocol: withProtocol,
    cleanUp: cleanUp,
    shorten: shorten,
    beautify: beautify
  };
});
