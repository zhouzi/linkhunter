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
* [Documentation](https://github.com/Zhouzi/LinkHunter/wiki)
* [Known "Limitations"](https://github.com/Zhouzi/LinkHunter#known-limitations)
* [Contributing](https://github.com/Zhouzi/LinkHunter/blob/gh-pages/CONTRIBUTING.md)
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

1. Include LinkHunter by:
   * Downloading the distributed file: [LinkHunter.min.js](https://raw.githubusercontent.com/Zhouzi/LinkHunter/master/dist/LinkHunter.min.js)
   * Installing via bower: `bower install linkhunter`
2. Link it in your markup: `<script src="path/to/LinkHunter.min.js"></script>`
3. You are now able to build a LinkHunter's instance: `var linkHunter = new LinkHunter();`



## Known "Limitations"

* Domain such as Twitter's `t.co` are matched so `a.bc` and `q.we` too
* Match user typed urls if followed or not by a punctuation mark and a space so `github.com` is matched in `github.com!` and `github.com! ` but not in `github.com!Whatever`.
* User typed links (meaning urls without a protocol) can't contain a punctuation mark after the first slash. It means that `github.com` is properly matched in `Go to github.com! And let me know` and not `github.com!`. It also means that `github.com/angular.js` is not considered as a valid "user typed" url because we can't be sure whether what's behind the punctuation mark (the dot in this case) is part of the url or not. Adding the protocol fix it so `http://github.com/angular.js` is perfectly valid.



## Change log

### 2.1.0 - Unreleased

* [ ] Add support for non-browser environment.

### 2.0.0 - 2015-07-04

* `mailto:` is now considered to be emails' protocol, meaning `Link('email@domain.com').withProtocol()` now returns `mailto:email@domain.com`.
* The `targetBlank` option of `.linky()` is replaced by `target` to allow any target value.
* Improved the email matching.
 * It's now using the "domain pattern" regexp and match properly `firstname.lastname@email.address-site.com`.
 * Added more tests to the specs.
* `.getLinks()` now ignore emails by default.
* `.looksLikeALink()` now ignore emails by default.
* Added the `forceCleanUp` option to `.shorten()` (true by default).
* LinkHunter is now available as a bower component: `bower install linkhunter`.

### 1.1.0 - 2015-06-30

* Lots of improvements in the regexp
    * Regular urls (the ones with a protocol) now also benefit from the domain pattern. Which means that everything that's before the first slash must looks like a domain name so `http://.` is no more matched for example.
    * Partial urls are no more matched by the "user typed" regexp. Meaning `github.com/angular` is no more matched from `github.com/angular.js`. In such case the url is completely dropped because:
        1. Matching partial urls is pointless and would surely lead to mistakes.
        2. We can't be sure whether what's behind the punctuation mark (the dot in this case) is part of the url or not.
* Added a `.replaceLinks(callback)` method so your could benefit from LinkHunter's regexps to replace links the way you want to. This is method is now also used by `.linky()`.
* `.linky()` now supports more options like beautify, shorten and clean up.
* Every link object has now a `.originalHasProtocol` property which is true when the original url has a protocol.
* LinkHunter is now also available as an Angular module.
* Fixed an issue where `.getLinks()` wasn't setting emails' type to "email".

### 1.0.0 - 2015-06-28

First release.
