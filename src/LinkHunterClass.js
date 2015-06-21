import LinkClass from './LinkClass';

export default class LinkHunterClass {
    constructor () {
        let baseLinkRegexp = '((?:https?:\/\/)?[-a-zA-Z0-9:%_\\+~=?][-a-zA-Z0-9@:%._\\+~#=?]{0,255}\\.[a-z]{2,6}[-a-zA-Z0-9@:%._\\+~#=\/&\\[\\]?]*)';

        this.regexps =  {
            linkStrict: new RegExp(`^${baseLinkRegexp}$`),
            linkGlobal: new RegExp(baseLinkRegexp, 'g')
        };
    }

    isLink (str, ignoreEmail = true) {
        // if there's an @ then consider it's an email
        if (ignoreEmail && str.indexOf('@') >= 0) return false;

        // remove links that start or end by a dot
        // it means that in "Have a look at site.com." site.com won't be matched
        if (str.charAt(0) == '.' || str.charAt(str.length - 1) == '.') return false;

        // does it actually looks like a link?
        if (!this.regexps.linkStrict.test(str)) return false;

        // remove links such as site...com
        if (/\.{2,}/g.test(str)) return false;

        return true;
    }

    getLinks (str, ignoreEmail = true) {
        let links = str.match(this.regexps.linkGlobal) || [];

        let self = this;
        return links
            .filter(link => { return self.isLink(link, ignoreEmail); })
            .map(link => { return new LinkClass(link); });
    }

    linkify (str, options = { ignoreEmail: false, targetBlank: false }) {
        let linkTemplate = options.targetBlank ?
            '<a href="{{formatted}}" target="_blank">{{original}}</a>' :
            '<a href="{{formatted}}">{{original}}</a>';

        let self = this;
        let link;

        return str.replace(self.regexps.linkGlobal, function ($0) {
            if (self.isLink($0, options.ignoreEmail)) {
                link = new LinkClass($0);

                if (link.type == 'email') return `<a href="mailto:${link.original}">${link.original}</a>`;
                else return linkTemplate.replace('{{formatted}}', link.toFormatted()).replace('{{original}}', link.original);
            }

            return $0;
        });
    }
}