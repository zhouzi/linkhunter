# linkHunter

*Description...*



## Known Limitations

* Urls such as `t.co` are matched.
* Urls that start or end by a dot won't be matched. So in `Have a look at site.com.` the url `"site.com"` will be lost because of the dot.


## Rules

* An url has at least two parts: a sub domain and a tld which can't contain `/:?,`
* An url can't contain successive slashes like `site.com//page` (apart from protocol)


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