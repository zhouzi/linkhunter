export default class linkClass {
    constructor (link) {
        this.original = link;
        this.type     = link.indexOf('@') >= 0 ? 'email' : 'url';
    }

    toFormatted (protocol = 'http://') {
        if (this.type == 'email') return this.original;
        else return /^https?:\/\//.test(this.original) ? this.original : protocol + this.original;
    }

    shorten (maxLength, strict = true) {
        if (this.type == 'email') return this.original.substr(0, maxLength);

        let link = this.original;
        if (link.length < maxLength) return link;

        link = link.replace(/^https?:\/\//, '');

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
}