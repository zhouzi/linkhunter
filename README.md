# LinkHunter

Detect links that real users actually type.

In theory, an url is supposed to be prefixed by a protocol (e.g http://) so `http://site.com/` is correct while `site.com` is not.
The thing is, users rarely refer to a site by mentioning its protocol.
The purpose of LinkHunter is to match everything that actually looks like a link so both `http://site.com/` and `site.com` are correct.

It also means that LinkHunter is really permissive because an url could be almost anything.
Make sure you are aware of the [known limitations]().



## Features

* Detect anything that looks like an url to humans.
* Detect emails as well (with a specific type).
* Return link objects with some special features like proper shortening, a "beautifier", and [more]().



## Usage

1. Download [LinkHunter.min.js]()
2. Link it in your markup: `<script src="path/to/LinkHunter.min.js"></script>`
3. You are now able to build a LinkHunter's instance: `var linkHunter = new LinkHunter();`

For more details on features, please refer to the [documentation]().


## Documentation

### Instantiation

There is a couple of things you can configure with LinkHunter and this is why you need to build a new instance to get started.
It's as simple as:

```javascript
// Using defaults
var linkHunter = new LinkHunter();

// Custom options
var linkHunter = new LinkHunter({});
```

The available options are:

name|default|description
----|-------|-----------
/|/|/

### `linkHunter.isLink(string)`

Returns whether a string is a link or not.

```javascript
linkHunter.isLink('site.com'); // -> true
linkHunter.isLink('site...com'); // -> false
```

**Arguments**

1. string: the subject to test

### `linkHunter.getLinks(string)`

Returns a list of [link objects]() from a text/string.

```javascript
linkHunter.getLinks('Hey guys have a look at site.com');
```

**Arguments**

1. string: a text where to search for urls
2. ignoreEmail (boolean): if true, ignore emails otherwise capture these too. Default is true.

### `linkHunter.linkify(string)`

Match all links from a text and replace them by an anchor.

```javascript
linkHunter.linkify('Hey guys have a look at site.com'); // -> 'Hey guys have a look at <a href="http://site.com">site.com</a>'
```

**Arguments**

1. string: a text where to search and replace urls
2. options (object):
    * `ignoreEmail`: whether it should ignore emails or not, default is false (so it replace emails by `mailto:`).
    * `targetBlank`: whether it should add the `target="_blank"` attribute or not, default is false.



### Link Objects

Some methods such as `linkHunter.getLinks` return a list of "link objects" with some special properties and methods.

#### Properties

* `link.original`: contains the original link.
* `link.type`: can be `url` or `email`.

#### Methods

##### `link.toFormatted()`

Return the link adding a protocol if needed. The default protocol is `http://` but can be changed by doing so:

```javascript
link.toFormatted('https://'); // -> return https://site.com
```

**Note:** the protocol is added only if missing so if the original link was `http://site.com`, `link.toFormatted()` would return the same value.

##### `link.shorten(40)`

Shorten a link by first removing the protocol and then doing its best to keep the last part of the url.
So for example, in `http://site.com/some/blog/article-title` the goal would be to keep `site.com` and `article-title` ending in: `site.com/.../article-title`.
The fact is, the last part of urls are often what describes the page's content.

```javascript
// link.original -> 'http://site.com/some/blog/article-title'
link.shorten(20); // -> 'site.com/.../arti...'
link.shorten(20, false); // -> 'site.com/.../article-title'
```

**Arguments**

1. int: max length of the shortened link
2. strict (boolean): ...

##### `link.beautify()`

Keep what's supposed to be the more relevant part of the url: domain name and last part of the url.

```javascript
// link.original -> 'http://site.com/some/blog/article-title?with=params#hash'
link.beautify(); // 'site.com/.../?with=params#hash'
link.beautify(true); // 'site.com/.../article-title'
```

**Arguments**

1. removeQueryParams (boolean): remove query params (everything that is behind the last `?`), default is false.



## Known Limitations

* A domain is valid starting from 1 character while the minimum for a tld is 2. It means that Twitter's `t.co` would be matched as well as `a.bc`, `a.qw`, and so on.
* For now, urls ending by a dot are not matched. Meaning `site.com` won't be detected in `"Have a look at site.com."` because of the trailing dot.



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

### 1.0.0 - Unreleased

* [x] Add `beautify`
* [ ] Review code
* [ ] Review tests
* [ ] Improve email detection
* [ ] Add & update documentation
* [x] Add demo page
* [ ] Add a significant amount of test subjects
* [ ] Review demo page markup
* [ ] Add GA tracker