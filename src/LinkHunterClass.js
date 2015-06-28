import LinkClass from './LinkClass';
import utils from './utils';

const EMAIL_REGEXP      = '[^\\s]+@[^\\s.]+\\.[-a-z]{2,10}';
const REGULARURL_REGEXP = 'https?:\/\/(?:[a-z0-9]{1,255}\\.)+[a-z]{2,10}[^\\s]*';
const USERURL_REGEXP    = '(?:[a-z0-9]{1,255}\\.)+[a-z]{2,10}[^.\\s"\'!?:,;]*';
const LINK_REGEXP       = `((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}))`;

export default class LinkHunterClass {
    constructor () {
        this.regexps =  {
            email:      new RegExp(`^${EMAIL_REGEXP}$`, 'i'),
            regularUrl: new RegExp(`^${REGULARURL_REGEXP}$`, 'i'),
            userUrl:    new RegExp(`^${USERURL_REGEXP}$`, 'i'),
            link:       new RegExp(`^${LINK_REGEXP}$`, 'i'),
            links:      new RegExp(LINK_REGEXP, 'gi')
        };
    }

    looksLikeAnEmail (str) {
        return this.regexps.email.test(str);
    }

    looksLikeALink (str, ignoreEmail = false) {
        if (ignoreEmail && this.looksLikeAnEmail(str)) return false;
        return this.regexps.link.test(str);
    }

    getLinks (str, ignoreEmail = false) {
        let links = str.match(this.regexps.links) || [];

        if (ignoreEmail) {
            let self = this;
            links = links.filter(link => { return !self.looksLikeAnEmail(link); });
        }

        return links.map(link => { return new LinkClass(link); });
    }

    replaceLinks (str, callback, context = this) {
        let self = this;
        return str.replace(this.regexps.links, link => {
            return callback.call(context, new LinkClass(link, self.looksLikeAnEmail(link)));
        });
    }

    linky (str, options = {}) {
        let defaults = { ignoreEmail: false, targetBlank: false, protocol: 'http://' };
        options = utils.merge(defaults, options);

        let linkTemplate =
            options.targetBlank ?
            '<a href="{{formatted}}" target="_blank">{{original}}</a>' :
            '<a href="{{formatted}}">{{original}}</a>';

        return this.replaceLinks(str, (link) => {
            if (options.ignoreEmail && link.type == 'email') return link.original;

            if (link.type == 'email') return `<a href="mailto:${link.original}">${link.original}</a>`;
            else return linkTemplate.replace('{{formatted}}', link.withProtocol(options.protocol)).replace('{{original}}', link.original);
        });
    }
}