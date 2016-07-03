import assert from 'assert';
import beautify from '../beautify';

describe('beautify', () => {
  it('should make an url look nicer', () => {
    const subject = 'http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash';
    const expected = 'site.com/.../article-title';

    assert.equal(beautify(subject, expected), expected);
  });

  it('should preserve the query parameters', () => {
    const subject = 'http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash';
    const expected = 'site.com/.../article-title?utf8&some=tracker#hash';

    assert.equal(beautify(subject, false), expected);
  });
});
