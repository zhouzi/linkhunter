import assert from 'assert';
import hasProtocol from '../hasProtocol';

describe('hasProtocol', () => {
  it('should return true if the link has a protocol', () => {
    assert.equal(hasProtocol('http://site.com'), true);
    assert.equal(hasProtocol('https://site.com'), true);
    assert.equal(hasProtocol('mailto:email@domain.com'), true);
  });

  it('should return false if the link has no protocol', () => {
    assert.equal(hasProtocol('site.com'), false);
    assert.equal(hasProtocol('email@domain.com'), false);
  });

  it('should be case insensitive', () => {
    assert.equal(hasProtocol('HtTp://site.com'), true);
    assert.equal(hasProtocol('mAiLtO:email@domain.com'), true);
  });
});
