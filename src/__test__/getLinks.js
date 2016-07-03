import assert from 'assert';
import getLinks from '../getLinks';

describe('getLinks', () => {
  const subjects = [
    {
      subject: 'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys!\nAnd say hello@someone.com! And john.doe@domain.more-domain.tld.\nOh and what about github.com/angular.js! Let me know what you think.',
      expected: [
        'site.com/whatever',
        'http://www.domain.com/some/sub/path?with=params#hash',
        'hello@someone.com',
        'john.doe@domain.more-domain.tld',
        'github.com/angular.js'
      ]
    },

    {
      subject: 'Have a look at github.com/angular.js guys!',
      expected: [
        'github.com/angular.js'
      ]
    },

    {
      subject: 'Have a look at github.com! site.com.',
      expected: [
        'github.com',
        'site.com'
      ]
    },

    {
      subject: 'Did you see this? (site.com)',
      expected: [
        'site.com'
      ]
    },

    {
      subject: 'Did you see this? (http://site.com)',
      expected: [
        'http://site.com'
      ]
    },

    {
      subject: 'Did you see this? (site.com/some/sub/path/whatever)',
      expected: [
        'site.com/some/sub/path/whatever'
      ]
    },

    {
      subject: 'Did you see this? (http://site.com/some/sub/path/whatever)',
      expected: [
        'http://site.com/some/sub/path/whatever'
      ]
    },

    {
      subject: 'Did you see this site.com/some/path?',
      expected: [
        'site.com/some/path'
      ]
    },

    {
      subject: 'Did you see this http://site.com/some/sub/path/whatever?',
      expected: [
        'http://site.com/some/sub/path/whatever'
      ]
    },

    {
      subject: 'Did you see this someone@domain.tld?',
      expected: [
        'someone@domain.tld'
      ]
    },

    {
      subject: '(someone@domain.tld) is the right email address',
      expected: [
        'someone@domain.tld'
      ]
    },

    {
      subject: 'Go to site.com... And let me know someone@domain.com!!',
      expected: [
        'site.com',
        'someone@domain.com'
      ]
    },

    {
      subject: 'Go to github.com/angular. js!',
      expected: [
        'github.com/angular'
      ]
    },

    {
      subject: 'Go to (github.com/angular.js)!',
      expected: [
        'github.com/angular.js'
      ]
    },

    {
      subject: 'Have a look at:http://site.com/',
      expected: [
        'http://site.com/'
      ]
    },

    {
      subject: 'What about that?http://site.com/',
      expected: [
        'http://site.com/'
      ]
    },

    {
      subject: 'Have a look at:site.com',
      expected: [
        'site.com'
      ]
    },

    {
      subject: 'Have a look at?site.com',
      expected: [
        'site.com'
      ]
    },

    {
      subject: 'Have a look at:someone@email.com',
      expected: [
        'someone@email.com'
      ]
    },

    {
      subject: 'Have a look at?someone@email.com',
      expected: [
        'someone@email.com'
      ]
    },

    {
      subject: 'What\'s that (email(some(stuff@domain.com))with something else',
      expected: [
        'stuff@domain.com'
      ]
    },

    {
      subject: 'What\'s that (email(some(stuff.domain.com))with something else',
      expected: [
        'stuff.domain.com'
      ]
    },

    {
      subject: 'What\'s that (email(some(http://stuff.domain.com))with something else',
      expected: [
        'http://stuff.domain.com'
      ]
    },

    {
      subject: 'Some string ((whatever(site.com)some stuff) there',
      expected: [
        'site.com'
      ]
    },

    {
      subject: 'Whatever (stuff((there(or(someone@domain.com)So weird) string...',
      expected: [
        'someone@domain.com'
      ]
    }
  ];
  subjects.forEach(obj => {
    it(`should the links from "${obj.subject}"`, () => {
      assert.deepEqual(getLinks(obj.subject), obj.expected);
    });
  });
});
