# linkhunter

Detect links that real users actually type.

linkhunter is focussed on matching links from user inputs.
To do so, it considers three type of links: emails (someone@domain.com), urls with a protocol (http://site.com/) and finally user-typed url (site.com).
It means that linkhunter is able to match:

* `http://twitter.com/` in `Have a look at http://twitter.com/`
* `github.com` in `Feel free to submit an issue on github.com!`
* `someone@domain.com` in `Should I contact someone@domain.com?`
* `twitter.com` in `Did you visit twitter? (twitter.com)`

*Note that linkhunter is meant to extract links from user's input but not to strictly validate urls or emails.
For example, `user@domain` is considered to be a valid email per the specifications but not by linkhunter.*

* [Usage](https://github.com/Zhouzi/linkhunter#usage)
* [Documentation](https://github.com/Zhouzi/linkhunter/wiki)
* [Known "Limitations"](https://github.com/Zhouzi/linkhunter#known-limitations)
* [Contributing](https://github.com/Zhouzi/linkhunter/blob/gh-pages/CONTRIBUTING.md)
* [Change Log](https://github.com/Zhouzi/linkhunter#change-log)



## Usage

linkhunter follows the UMD (Universal Module Definition) pattern which means it works everywhere.

1. Get the linkhunter.min.js file by whether:
  * Downloading the distributed version: [linkhunter.min.js](https://raw.githubusercontent.com/Zhouzi/linkhunter/gh-pages/dist/linkhunter.min.js)
  * Installing via bower: `bower install linkhunter`
2. Include it in your markup: `<script src="path/to/linkhunter.min.js"></script>` (or `require('linkhunter.min.js')` in NodeJS apps)



## Known "Limitations"

* Domains such as Twitter's `t.co` are matched, meaning `a.bc` and `q.we` too.



## Change log

### 3.2.0 - Unreleased

* [ ] Add more filter to the Angular module
    * [ ] `shorten`
    * [ ] `beautify`
    * [ ] `withProtocol`

### 3.1.0 - 2015-07-30

* Improved regular expressions to avoid matching trailing punctuation marks and wrappers. Meaning it's now able to match:
    * `site.com` in `(site.com)`, `site.com.`, `site.com...`, `site.com!`, and so on.
    * `site.com` in `Some string ((whatever(site.com)some stuff) there`
    * `someone@domain.com` in `Whatever (stuff((there(or(someone@domain.com)So weird) string...`
* Improved user-typed url regexp to match `github.com/angular.js` (urls with punctuation marks)
* Improved regexp to match protocoled urls, no matter what's preceding it. It's now able to match `http://site.com` in `What?http://site.com`
* Fixed urls regexps to avoid matching sub paths that do not start by a slash. It's no more matching `site.com)whatever` but `site.com/whatever`

### 3.0.2 - 2015-07-07

* Fixed angular linky filter name.

### 3.0.1 - 2015-07-07

* Renamed the angular filter to `linkhunterLinky`.

### 3.0.0 - 2015-07-06

* The usage of linkhunter as a constructor made no sense so it's now just an object exposing the whole API.
* The LinkClass has been removed and each of its method has been transferred to linkhunter. It means that chaining operation is now much more simple and there's less concepts to learn.
* `linkhunter.linky()`'s `operation` option has been replaced by individual properties that alter the link's display value (see documentation for more details).
* The angular wrapper has been updated (module, service and filter renamed).
* Added support for non-browser environment by following the UMD pattern.

### 2.0.1 - 2015-07-04

* Update README.md on usage.
* Update bower's ignore.

### 2.0.0 - 2015-07-04

* `mailto:` is now considered to be emails' protocol, meaning `Link('email@domain.com').withProtocol()` now returns `mailto:email@domain.com`.
* The `targetBlank` option of `.linky()` is replaced by `target` to allow any target value.
* Improved the email matching.
 * It's now using the "domain pattern" regexp and match properly `firstname.lastname@email.address-site.com`.
 * Added more tests to the specs.
* `.getLinks()` now ignore emails by default.
* `.looksLikeALink()` now ignore emails by default.
* Added the `forceCleanUp` option to `.shorten()` (true by default).
* linkhunter is now available as a bower component: `bower install linkhunter`.

### 1.1.0 - 2015-06-30

* Lots of improvements in the regexp
  * Regular urls (the ones with a protocol) now also benefit from the domain pattern. Which means that everything that's before the first slash must looks like a domain name so `http://.` is no more matched for example.
  * Partial urls are no more matched by the "user typed" regexp. Meaning `github.com/angular` is no more matched from `github.com/angular.js`. In such case the url is completely dropped because:
    1. Matching partial urls is pointless and would surely lead to mistakes.
    2. We can't be sure whether what's behind the punctuation mark (the dot in this case) is part of the url or not.
* Added a `.replaceLinks(callback)` method so your could benefit from linkhunter's regexps to replace links the way you want to. This is method is now also used by `.linky()`.
* `.linky()` now supports more options like beautify, shorten and clean up.
* Every link object has now a `.originalHasProtocol` property which is true when the original url has a protocol.
* linkhunter is now also available as an Angular module.
* Fixed an issue where `.getLinks()` wasn't setting emails' type to "email".

### 1.0.0 - 2015-06-28

First release.
