window.subjects = 
  {
    links: {
      correct: [
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
      ],
  
      incorrect: [
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
      ]
    },
  
    emails: {
      correct: [
        'email@domain.com',
        'email@domain-sub.domain.com',
        'some-email+whatever@domain-sub.domain.whatever'
      ],
  
      incorrect: [
        'email@domain',
        'someone@domain!com',
        'someone@domain%.com+something',
        'email@domain.thisisawaytoologtopleveldomain'
      ]
    },
  
    extract: [
      {
        value: 'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys!\nAnd say hello@someone.com! And john.doe@domain.more-domain.tld.\nOh and what about github.com/angular.js! Let me know what you think.',
        includeEmail: true,
        expectation: [
          'site.com/whatever',
          'http://www.domain.com/some/sub/path?with=params#hash',
          'hello@someone.com',
          'john.doe@domain.more-domain.tld',
          'github.com/angular.js'
        ]
      },
  
      {
        value: 'Have a look at github.com/angular.js guys!',
        includeEmail: false,
        expectation: ['github.com/angular.js']
      },
  
      {
        value: 'Have a look at github.com! site.com.',
        includeEmail: false,
        expectation: [
          'github.com',
          'site.com'
        ]
      },
  
      {
        value: 'Did you see this? (site.com)',
        includeEmail: false,
        expectation: ['site.com']
      },
  
      {
        value: 'Did you see this? (http://site.com)',
        includeEmail: false,
        expectation: ['http://site.com']
      },
  
      {
        value: 'Did you see this? (site.com/some/sub/path/whatever)',
        includeEmail: false,
        expectation: ['site.com/some/sub/path/whatever']
      },
  
      {
        value: 'Did you see this? (http://site.com/some/sub/path/whatever)',
        includeEmail: false,
        expectation: ['http://site.com/some/sub/path/whatever']
      },
  
      {
        value: 'Did you see this site.com/some/path?',
        includeEmail: false,
        expectation: ['site.com/some/path']
      },
  
      {
        value: 'Did you see this http://site.com/some/sub/path/whatever?',
        includeEmail: false,
        expectation: ['http://site.com/some/sub/path/whatever']
      },
  
      {
        value: 'Did you see this someone@domain.tld?',
        includeEmail: true,
        expectation: ['someone@domain.tld']
      },
  
      {
        value: '(someone@domain.tld) is the right email address',
        includeEmail: true,
        expectation: ['someone@domain.tld']
      },
  
      {
        value: 'Go to site.com... And let me know someone@domain.com!!',
        includeEmail: true,
        expectation: ['site.com', 'someone@domain.com']
      },
  
      {
        value: 'Go to github.com/angular. js!',
        includeEmail: false,
        expectation: ['github.com/angular']
      },
  
      {
        value: 'Go to (github.com/angular.js)!',
        includeEmail: false,
        expectation: ['github.com/angular.js']
      },
  
      {
        value: 'Have a look at:http://site.com/',
        includeEmail: false,
        expectation: ['http://site.com/']
      },
  
      {
        value: 'What about that?http://site.com/',
        includeEmail: false,
        expectation: ['http://site.com/']
      },
  
      {
        value: 'Have a look at:site.com',
        includeEmail: false,
        expectation: ['site.com']
      },
  
      {
        value: 'Have a look at?site.com',
        includeEmail: false,
        expectation: ['site.com']
      },
  
      {
        value: 'Have a look at:someone@email.com',
        includeEmail: true,
        expectation: ['someone@email.com']
      },
  
      {
        value: 'Have a look at?someone@email.com',
        includeEmail: true,
        expectation: ['someone@email.com']
      },
  
      {
        value: 'What\'s that (email(some(stuff@domain.com))with something else',
        includeEmail: true,
        expectation: ['stuff@domain.com']
      },
  
      {
        value: 'What\'s that (email(some(stuff.domain.com))with something else',
        includeEmail: false,
        expectation: ['stuff.domain.com']
      },
  
      {
        value: 'What\'s that (email(some(http://stuff.domain.com))with something else',
        includeEmail: false,
        expectation: ['http://stuff.domain.com']
      },
  
      {
        value: 'Some string ((whatever(site.com)some stuff) there',
        includeEmail: false,
        expectation: ['site.com']
      },
  
      {
        value: 'Whatever (stuff((there(or(someone@domain.com)So weird) string...',
        includeEmail: true,
        expectation: ['someone@domain.com']
      }
    ]
  }
;