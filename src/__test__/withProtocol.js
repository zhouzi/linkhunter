import assert from 'assert';
import withProtocol from '../withProtocol';

describe('withProtocol', () => {
  it('should return the link with a protocol when it\'s missing', () => {
    assert.equal(withProtocol('site.com'), 'http://site.com');
    assert.equal(withProtocol('site.com', 'https://'), 'https://site.com');
    assert.equal(withProtocol('hello@someone.com'), 'mailto:hello@someone.com');
  });

  it('should not add invalid protocols to emails', () => {
    assert.equal(withProtocol('hello@someone.com', 'http://'), 'mailto:hello@someone.com');
    assert.equal(withProtocol('hello@someone.com', 'https://'), 'mailto:hello@someone.com');
  });

  it('should not alter the link if it already has a protocol', () => {
    assert.equal(withProtocol('http://site.com'), 'http://site.com');
    assert.equal(withProtocol('https://site.com'), 'https://site.com');
  });
});
