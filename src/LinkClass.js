export default class LinkClass {
    constructor (link) {
        this.original = link;
        this.type     = link.indexOf('@') >= 0 ? 'email' : 'url';
    }

    toFormatted (protocol = 'http://') {
        if (this.type == 'email') return this.original;
        else return /^https?:\/\//.test(this.original) ? this.original : protocol + this.original;
    }

    static cleanUp (link, removeQueryParams = false) {
        if (removeQueryParams) {
            var indexOfQueryParams = link.lastIndexOf('?');
            if (indexOfQueryParams >= 0) link = link.substr(0, indexOfQueryParams);
        }

        link = link.replace(/^https?:\/\//, '').replace(/\/#?$/, '');

        return link;
    }

    shorten (maxLength, strict = true) {
        if (this.type == 'email') return this.original.substr(0, maxLength);

        let link = this.original;
        if (link.length < maxLength) return link;

        link = LinkClass.cleanUp(link);

        let fragments = link.split('/');
        let start     = fragments.shift() + '/';
        let end       = fragments.pop();

        for (let i = 0, fragment; i < fragments.length; i++) {
            fragment = fragments[i];

            if ((start + fragment + '/' + end).length <= maxLength) {
                start += fragment + '/';
            } else {
                start += '.../';
                break;
            }
        }

        let shortenedUrl = start + end;
        if (strict && shortenedUrl.length > maxLength) shortenedUrl = shortenedUrl.substr(0, maxLength - 3) + '...';

        return shortenedUrl;
    }

    beautify (removeQueryParams = false) {
        if (this.type == 'email') return this.original;

        let link = LinkClass.cleanUp(this.original, removeQueryParams);
        let fragments = link.split('/');

        // if there is no sub path e.g. site.com
        if (fragments.length === 1) return link;

        if (fragments.length > 2) return fragments.shift() + '/.../' + fragments.pop();
        else return fragments.shift() + '/' + fragments.pop();
    }
}