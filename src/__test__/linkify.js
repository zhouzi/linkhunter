import assert from 'assert';
import linkify from '../linkify';

describe('linkify', () => {
  it('should replace links by an <a> tag', () => {
    const subject = [
      'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys!',
      'And say hello@someone.com! And john.doe@domain.more-domain.tld.',
      'Oh and what about github.com/angular.js! Let me know what you think.'
    ].join('\n');
    const expected = [
      'Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">http://www.domain.com/some/sub/path?with=params#hash</a> guys!',
      'And say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.',
      'Oh and what about <a href="http://github.com/angular.js">github.com/angular.js</a>! Let me know what you think.'
    ].join('\n');

    assert.equal(linkify(subject), expected);
  });

  // TODO: this test is far from being optimal
  it('should call the provided function for each link', () => {
    const subject = 'Have a look at site.com and http://whatever.com/ guys! hello@someone.com';
    const expected = 'Have a look at REPLACEMENT and REPLACEMENT guys! REPLACEMENT';

    assert.equal(linkify(subject, () => 'REPLACEMENT'), expected);
  });
});
