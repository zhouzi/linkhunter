export default class LinkClass {
    constructor (link, isEmail) {
        this.original = link;
        this.type     = isEmail ? 'email' : 'url';
    }

    static addEllipsis (str, maxLength = str.length, ellipsis = '...') {
        return str.substr(0, maxLength - ellipsis.length) + ellipsis;
    }

    originalHasProtocol () {
        return /^https?:\/\//.test(this.original);
    }

    withProtocol (protocol = 'http://') {
        if (this.type == 'email') return this.original;
        return this.originalHasProtocol() ? this.original : protocol + this.original;
    }

    cleanUp (removeQueryParams = false) {
        let link = this.original;

        if (removeQueryParams) {
            var indexOfQueryParams = link.lastIndexOf('?');
            if (indexOfQueryParams >= 0) link = link.substr(0, indexOfQueryParams);
        }

        link = link.replace(/^https?:\/\//, '').replace(/\/#?$/, '');

        return link;
    }

    shorten (maxLength) {
        if (this.type == 'email') return this.original.substr(0, maxLength);

        let link = this.original;
        if (link.length <= maxLength || (link = this.cleanUp()).length <= maxLength) return link;

        return LinkClass.addEllipsis(link, maxLength);
    }

    beautify (removeQueryParams = true) {
        if (this.type == 'email') return this.original;

        let link = this.cleanUp(removeQueryParams);

        // if there is no sub path e.g. site.com
        if (link.indexOf('/') < 0) return link;

        let fragments = link.split('/');

        if (fragments.length > 2) return fragments.shift() + '/.../' + fragments.pop();
        else return fragments.shift() + '/' + fragments.pop();
    }
}