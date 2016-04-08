/* global describe, subjects, it, expect, linkhunter, subjects, beforeEach */
/* eslint-disable max-len */

describe('linkhunter', function () {
  describe('linkhunter.looksLikeALink', function () {
    subjects.links.correct.forEach(function (str) {
      it('should return true for ' + str, function () {
        expect(linkhunter.looksLikeALink(str, true)).toBe(true);
      });
    });

    subjects.links.incorrect.forEach(function (str) {
      it('should return false for ' + str, function () {
        expect(linkhunter.looksLikeALink(str)).toBe(false);
      });
    });
  });

  describe('linkhunter.looksLikeAnEmail', function () {
    subjects.emails.correct.forEach(function (str) {
      it('should return true for ' + str, function () {
        expect(linkhunter.looksLikeAnEmail(str)).toBe(true);
      });
    });

    subjects.emails.incorrect.forEach(function (str) {
      it('should return false for ' + str, function () {
        expect(linkhunter.looksLikeAnEmail(str)).toBe(false);
      });
    });
  });

  describe('linkhunter.getLinks', function () {
    subjects.extract.forEach(function (obj) {
      it('should get links from "' + obj.value + '"', function () {
        expect(linkhunter.getLinks(obj.value, obj.includeEmail)).toEqual(obj.expectation);
      });
    });
  });

  describe('Manipulating strings', function () {
    var text;
    beforeEach(function () {
      text =
        [
          'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys!',
          'And say hello@someone.com! And john.doe@domain.more-domain.tld.',
          'Oh and what about github.com/angular.js! Let me know what you think.'
        ].join('\n');
    });

    it('should replace links by an html anchor tag', function () {
      expect(linkhunter.linky(text)).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.\nOh and what about <a href="http://github.com/angular.js">github.com/angular.js</a>! Let me know what you think.');
    });

    it('should replace links by an html anchor tag and respect options', function () {
      expect(linkhunter.linky(text, {
        ignoreEmail: true,
        target: '_blank',
        protocol: 'https://'
      })).toBe('Have a look at <a href="https://site.com/whatever" target="_blank">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash" target="_blank">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say hello@someone.com! And john.doe@domain.more-domain.tld.\nOh and what about <a href="https://github.com/angular.js" target="_blank">github.com/angular.js</a>! Let me know what you think.');
    });
  });

  describe('Using linky\'s options', function () {
    var text = 'Go to http://site.com/some/sub/path/to/article/#';

    it('should replace links and clean up display value', function () {
      expect(linkhunter.linky(text, { displayValue: { cleanUp: true } })).toBe('Go to <a href="http://site.com/some/sub/path/to/article/#">site.com/some/sub/path/to/article</a>');
    });

    it('should replace links and beautify display value', function () {
      expect(linkhunter.linky(text, { displayValue: { beautify: true } })).toBe('Go to <a href="http://site.com/some/sub/path/to/article/#">site.com/.../article</a>');
    });

    it('should replace links and shorten display value', function () {
      expect(linkhunter.linky(text, { displayValue: { shorten: 20 } })).toBe('Go to <a href="http://site.com/some/sub/path/to/article/#">http://site.com/s...</a>');
    });

    it('should replace links and clean up + shorten display value', function () {
      expect(linkhunter.linky(text, {
        displayValue: {
          cleanUp: true,
          shorten: 20
        }
      })).toBe('Go to <a href="http://site.com/some/sub/path/to/article/#">site.com/some/sub...</a>');
    });
  });

  it('should replace links and add protocol to display value', function () {
    expect(linkhunter.linky('Go to site.com', { displayValue: { withProtocol: true } })).toBe('Go to <a href="http://site.com">http://site.com</a>');
  });

  it('should call a callback for each links found in a string', function () {
    var str = linkhunter.replaceLinks('Have a look at site.com and http://whatever.com/ guys! hello@someone.com', function () {
      return 'REPLACEMENT';
    });

    expect(str).toBe('Have a look at REPLACEMENT and REPLACEMENT guys! REPLACEMENT');
  });

  it('should detect if an url has a protocol or not', function () {
    expect(linkhunter.hasProtocol('site.com')).toBe(false);
    expect(linkhunter.hasProtocol('http://site.com')).toBe(true);
    expect(linkhunter.hasProtocol('https://site.com')).toBe(true);
    expect(linkhunter.hasProtocol('email@domain.com')).toBe(false);
    expect(linkhunter.hasProtocol('mailto:email@domain.com')).toBe(true);

    expect(linkhunter.hasProtocol('HtTp://site.com')).toBe(true);
    expect(linkhunter.hasProtocol('mAiLtO:email@domain.com')).toBe(true);
  });

  it('should add a protocol if needed', function () {
    expect(linkhunter.withProtocol('site.com')).toBe('http://site.com');
    expect(linkhunter.withProtocol('site.com', 'https://')).toBe('https://site.com');

    expect(linkhunter.withProtocol('http://site.com')).toBe('http://site.com');
    expect(linkhunter.withProtocol('https://site.com')).toBe('https://site.com');

    expect(linkhunter.withProtocol('hello@someone.com')).toBe('mailto:hello@someone.com');
    expect(linkhunter.withProtocol('hello@someone.com', 'http://')).toBe('mailto:hello@someone.com');
    expect(linkhunter.withProtocol('hello@someone.com', 'https://')).toBe('mailto:hello@someone.com');
  });

  it('should cleanup original link', function () {
    expect(linkhunter.cleanUp('http://site.com?some=params')).toBe('site.com?some=params');
    expect(linkhunter.cleanUp('http://site.com?some=params', true)).toBe('site.com');
    expect(linkhunter.cleanUp('http://site.com/', true)).toBe('site.com');
    expect(linkhunter.cleanUp('http://site.com/#', true)).toBe('site.com');
    expect(linkhunter.cleanUp('HtTps://SITE.com/#', true)).toBe('SITE.com');
  });

  it('should shorten a link', function () {
    expect(linkhunter.shorten('http://site.com/some/path', 12)).toBe('http://si...');
    expect(linkhunter.shorten('http://site.com/some/path', 99)).toBe('http://site.com/some/path');
  });

  it('should beautify a link', function () {
    expect(linkhunter.beautify('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash')).toBe('site.com/.../article-title');
    expect(linkhunter.beautify('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash', false)).toBe('site.com/.../article-title?utf8&some=tracker#hash');
  });
});
