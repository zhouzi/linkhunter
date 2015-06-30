# LinkHunter

Detect links that real users actually type.

LinkHunter's purpose is to match links that users type as well as the ones they copy/paste.
The difference between the two is that users rarely type urls in the form of `http://twitter.com/` but rather `twitter.com`.
It means that LinkHunter is able to match:

* `http://twitter.com/` in `Have a look at http://twitter.com/`
* `twitter.com` in `Have a look at twitter.com`
* `me@domain.com` in `Contact me@domain.com`

Note that LinkHunter is meant to extract links from user's input but not to strictly validate urls or emails.
For example, while `user@domain` is a correct email address, it won't match it but would work with `user@domain.com`.

When searching for "user typed" links, it will make sure to break on punctuation mark so `twitter.com` is properly matched in `Have a look at twitter.com!` and not `twitter.com!`.
It could be an issue if an user tries to type `twitter.com?some=params` but we assume that an user that is aware of the query parameter thing is also aware of the need of a protocol.
Adding a protocol solve the issue and match the url properly (`http://twitter.com?some=params`).

* [Features](https://github.com/Zhouzi/LinkHunter#features)
* [Usage](https://github.com/Zhouzi/LinkHunter#usage)
* [Documentation](https://github.com/Zhouzi/LinkHunter#documentation)
* [Known "Limitations"](https://github.com/Zhouzi/LinkHunter#known-limitations)
* [Contributing](https://github.com/Zhouzi/LinkHunter#contributing)
* [Change Log](https://github.com/Zhouzi/LinkHunter#change-log)



## Features

LinkHunter considers three types of links:

* copy/paste: `http://site.com/some/sub/path/to/article-title?some=tracker`
* user typed: `site.com/articles`
* email: `email@domain.com`

With that, it's able to:

* Shorten `http://site.com/some/sub/path/to/article-title?some=tracker` to `site.com/some...`
* Beautify `http://site.com/some/sub/path/to/article-title?some=tracker` to `site.com/.../article-title`
* Transform `Have a look at site.com and say hello@domain.com` to `Have a look at <a href="http://site.com" target="_blank">site.com</a> and say <a href="mailto:hello@domain.com">hello@domain.com</a>`

These are just a few of LinkHunter's capabilities, have at look at the [documentation](https://github.com/Zhouzi/LinkHunter#documentation) for more details.


## Usage

1. Download [LinkHunter.min.js](https://raw.githubusercontent.com/Zhouzi/LinkHunter/master/dist/LinkHunter.min.js)
2. Link it in your markup: `<script src="path/to/LinkHunter.min.js"></script>`
3. You are now able to build a LinkHunter's instance: `var linkHunter = new LinkHunter();`



## Documentation

### LinkHunter

#### Instantiation

The first thing to do is to create a new instance of LinkHunter.

```javascript
// Using defaults
var linkHunter = new LinkHunter();
```

#### `.looksLikeALink(string, ignoreEmail)`

Return whether or not a string looks like a link.

1. **string** (type: `string`) - The string to test.
2. **ignoreEmail** (type: `boolean`, default: `false`) - Whether it should ignore email or not (`true` means yes).

@return boolean

```javascript
linkHunter.looksLikeALink('site.com');               // -> true
linkHunter.looksLikeALink('http://site.com');        // -> true
linkHunter.looksLikeALink('email@domain.com');       // -> true
linkHunter.looksLikeALink('email@domain.com', true); // -> false
linkHunter.looksLikeALink('Whatever!');              // -> false
```

#### `.looksLikeAnEmail(string)`

Return whether or not a string looks like an email.

1. **string** (type: `string`) - The string to test.

@return boolean

```javascript
linkHunter.looksLikeAnEmail('email@domain.com'); // -> true
linkHunter.looksLikeAnEmail('http://site.com');  // -> false
```

#### `.getLinks(string, ignoreEmail)`

Extract links from a string.

1. **string** (type: `string`) - Where to search for links.
2. **ignoreEmail** (type: `boolean`, default: `false`) - Whether it should ignore email or not (`true` means yes).

@return an array of [link objects](https://github.com/Zhouzi/LinkHunter#link)

```javascript
linkHunter.getLinks('Say hello at email@domain.com!');
// -> [Link({ original: 'email@domain.com', type: 'email' })]

linkHunter.getLinks('Have a look at site.com!');
// -> [Link({ original: 'site.com', type: 'url' })]
```

#### `.replaceLinks(string, callback, context)`

Trigger a callback for each links found. The callback receive 1 argument: a link object.
The links will be replaced by callback's return value so make sure to return a string.

1. **string** (type: `string`) - Where to search and replaces links using callback.
2. **callback** (type: `function`) - Called for each links, receive a link object and must return the replacement value.
3. **context** (type: `/`, default: `linkHunter instance`) - Set callback's context.

@return string

```javascript
linkHunter.replaceLinks('Have a look at http://site.com/sub/path/to/article-title!', function (link) {
    return link.beautify();
});
// -> 'Have a look at site.com/.../article-title!'
```

#### `.linky(string, options)`

Match and transform links in a string into html anchor tags.
Note: this method is made for convenience and simply calls `.replaceLinks` internally.

1. **string** (type: `string`) - Where to search and replace links.
2. **options** (type: `object`, default: `object`) - See below.

**options**

|name|default|description|
|----|-------|-----------|
|ignoreEmail (boolean)|`false`|Whether it shouldn't replace email by `mailto:` or not|
|targetBlank (boolean)|`false`|Whether it should add the `target="_blank"` attribute or not|
|protocol (string)|`"http://"`|The protocol to prepend when needed|
|operation|{}|The operation to execute on each links|

@return string

```javascript
linkHunter.linky('Have a look at twitter.com and say hello at email@domain.com!', { ignoreEmail: false, targetBlank: false, protocol: 'http://' });
// -> "Have a look at <a href="http://twitter.com">twitter.com</a> and say hello at <a href="mailto:email@domain.com">email@domain.com</a>!"
```

An operation looks like `{ name: 'beautify', args: [] }` and what it does is that it calls the link's method `operation.name` and pass the arguments to modify the link's display value.

```javascript
linkHunter.linky('Have a look at http://site.com/sub/path/to/article-title!', { operation: { name: 'beautify', args: [] } });
// -> 'Have a look at <a href="http://site.com/sub/path/to/article-title">site.com/.../article-title</a>!'
```

### Link

Some of LinkHunter's methods return link objects which are documented below.

#### `.original`

Store the original link.

```javascript
Link('site.com').original // -> 'site.com'
```

#### `.type`

Store the type of the link (`url` or `email`).

```javascript
Link('site.com').type         // -> 'url'
Link('email@domain.com').type // -> 'email'
```

#### `.originalHasProtocol`

If `true`, means the original url has a protocol.

```javascript
Link('site.com').originalHasProtocol         // -> false
Link('http://site.com').originalHasProtocol  // -> true
Link('https://site.com').originalHasProtocol // -> true
```

#### `.withProtocol(protocol)`

Add the given protocol **if needed**.

1. **protocol** (type: string, default: `'http://'`) - The protocol to prepend when needed.

@return string

```javascript
Link('site.com').withProtocol()                  // -> 'http://site.com'
Link('site.com').withProtocol('https://')        // -> 'https://site.com'
Link('http://site.com').withProtocol('http://')  // -> 'http://site.com'
Link('http://site.com').withProtocol('https://') // -> 'http://site.com'
```

#### `.cleanUp(removeQueryParams)`

Remove the protocol, trailing `/` or `/#` (not `/#hash`).

1. **removeQueryParams** (type: boolean, default: `false`) - Whether it should remove query parameters or not.

@return string

```javascript
Link('http://site.com/#').cleanUp()               // -> site.com
Link('http://site.com?some=params').cleanUp()     // -> site.com?some=params
Link('http://site.com?some=params').cleanUp(true) // -> site.com
```

#### `.shorten(maxLength)`

If link's length is lesser than `maxLength`, first clean up and then if it's still too long does a substr.

1. **maxLength** (type: integer): the maximum length of the string to return.

@return string

```javascript
Link('http://site.com/some/sub/path').shorten(20) // -> 'site.com/some/sub...'
Link('http://site.com/some/sub/path').shorten(99) // -> 'http://site.com/some/sub/path'
```

#### `.beautify(removeQueryParams)`

Clean up a link and keep the last part of the url which often contains a clear reference to the page's content.

1. **removeQueryParams** (type: boolean, default: `true`) - Whether it should remove query parameters or not.

```javascript
Link('http://site.com/path/to/article-title?utf8&tracker=data').beautify()
// -> site.com/.../article-title

Link('http://site.com/path/to/article-title?utf8&tracker=data').beautify(false)
// -> site.com/.../article-title?utf8&tracker=data
```

### Angular Module

LinkHunter is also available as an angular module.
To use it in your application, include both the `dist/LinkHunter.min.js` and `dist/LinkHunter.angular.min.js` files.
Also declare it as a dependency like:

```javascript
angular.module('yourApplication', ['LinkHunter']);
```

You are now able to inject the `LinkHunterService` which is basically an instance of LinkHunter.

```javascript
angular
    .module('yourApplication', ['LinkHunter'])
    .controller('demoController', [
        'LinkHunterService',
        function (LinkHunterService) {}
    ])
;

```

This module also contains...

#### `huntLinky(options)` (filter)

Use `LinkHunter.linky()` to replace links by anchor tags in a string.

1. **options** (type: object): have a look at `.linky()`'s documentation.

```javascript
<div data-ng-bind-html="string|huntLinky: { targetBlank: true }"></div>
// considering: string = "Have a look at twitter.com!";
// it would result in: "Have a look at <a href="http://twitter.com" target="_blank">twitter.com</a>!"
```



## Known "Limitations"

* Domain such as Twitter's `t.co` are matched so `a.bc` and `q.we` too
* Match user typed urls if followed or not by a punctuation mark and a space so `github.com` is matched in `github.com!` and `github.com! ` but not in `github.com!Whatever`.
* User typed links (meaning urls without a protocol) can't contain a punctuation mark after the first slash. It means that `github.com` is properly matched in `Go to github.com! And let me know` and not `github.com!`. It also means that `github.com/angular.js` is not considered as a valid "user typed" url because we can't be sure whether what's behind the punctuation mark (the dot in this case) is part of the url or not. Adding the protocol fix it so `http://github.com/angular.js` is perfectly valid.



## Contributing

1. [Install NodeJS](https://nodejs.org/download/)
2. Install gulp globally: `npm install --global gulp`
3. Install dev dependencies: `npm install`

### Gulp Tasks

* `gulp scripts`: Generate the distributed version.
* `gulp watch`: Watch and run the relevant tasks when a `.scss` or `.js` file change.
* `gulp test`: Run the tests.
* `gulp styles`: Generate the `styles.css` file from `styles.scss`.
* `gulp serve`: Serve the demo page, run `gulp watch` and reload on changes.
* `gulp`: Run the `scripts` and `styles` tasks.



## Change log

### 2.0.0 - Unreleased

* [ ] Replace `targetBlank` by `target` to allow any target value.
* [ ] Add support for non-browser environment.

### 1.1.0 - Unreleased

* [x] Improve the regular url regexp to avoid matching `http://.` (add the domain pattern from user typed regexp).
* [x] Add a `.replaceLinks(callback)` method.
* [x] Add more options to `.linky()`: beautify, shorten, cleanUp.
* [x] Set `.originalHasProtocol()` as a property.
* [x] Improve regexp to avoid matching partical urls like `github.com/angular` in `github.com/angular.js`.
* [x] Fix issue with `.getLinks()` to properly set `.type` to `"email"` for emails.
* [x] Add an Angular module.

### 1.0.0 - 2015-06-28

First release.