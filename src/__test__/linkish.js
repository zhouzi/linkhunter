import assert from 'assert';
import isLinkish from '../isLinkish';

describe('isLinkish', () => {
  const validLinks = [
    'site.com',
    'site.com/whatever/it/is-some-things',
    'sub.site.site.domain.com',
    't.co',
    'http://site.com',
    'https://site.com',
    'https://site.com/some-sub/path/with?params=foo#hash',
    'user@email.com',
    'http://t.co',
    'github.com/angular.js'
  ];
  validLinks.forEach(subject => {
    it(`should consider ${subject} to be valid link`, () => {
      assert.equal(isLinkish(subject), true);
    });
  });

  const invalidLinks = [
    'site..com',
    's.c',
    'some.site.com.',
    'some.site.com!',
    '\'some.ste.com\'',
    '\'site.com\'',
    'github.com...',
    'user@email',
    'user@email..com',
    'user@email.c',
    'http://',
    'http://.',
    'http://t.c',
    'http://t.c9',
    'github.com/angular. js'
  ];
  invalidLinks.forEach(subject => {
    it(`should consider ${subject} to be an invalid link`, () => {
      assert.equal(isLinkish(subject), false);
    });
  });
});
