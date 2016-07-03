import assert from 'assert';
import cleanUp from '../cleanUp';

describe('cleanUp', () => {
  it('should remove the procotol', () => {
    const subject = 'http://site.com?some=params';
    const expected = 'site.com?some=params';

    assert.equal(cleanUp(subject), expected);
  });

  it('should remove the query parameters', () => {
    const subject = 'http://site.com?some=params';
    const expected = 'site.com';

    assert.equal(cleanUp(subject, true), expected);
  });

  it('should remove trailing slashes', () => {
    const subject = 'http://site.com/';
    const expected = 'site.com';

    assert.equal(cleanUp(subject, true), expected);
  });

  it('should remove trailing #', () => {
    const subject = 'http://site.com/#';
    const expected = 'site.com';

    assert.equal(cleanUp(subject, true), expected);
  });

  it('should be case consistent', () => {
    const subject = 'HtTps://SITE.com/#';
    const expected = 'SITE.com';

    assert.equal(cleanUp(subject, true), expected);
  });
});
