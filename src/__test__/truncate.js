import assert from 'assert';
import truncate from '../truncate';

describe('truncate', () => {
  it('should truncate the link if its length is greater than the max length', () => {
    const subject = 'http://site.com/some/path';
    const expected = 'http://si...';

    assert.equal(truncate(subject, 12), expected);
  });

  it('should not truncate the link if its length is lower than the max length', () => {
    const subject = 'http://site.com/some/path';
    const expected = subject;

    assert(truncate(subject, 99), expected);
  });
});
