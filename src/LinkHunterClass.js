import LinkClass from './LinkClass';
import utils from './utils';

const EMAIL_REGEXP      = '[^\\s]+@[^\\s.]+\\.[-a-z]{2,10}';
const REGULARURL_REGEXP = 'https?:\/\/(?:[a-z0-9]{1,255}\\.)+[a-z]{2,10}[^\\s]*';
const USERURL_REGEXP    = '(?:[a-z0-9]{1,255}\\.)+[a-z]{2,10}[^.\\s"\'!?:,;]*';

export default class LinkHunterClass {
    constructor () {
        this.regexps =  {
            email:      new RegExp(`^${EMAIL_REGEXP}$`, 'i'),
            regularUrl: new RegExp(`^${REGULARURL_REGEXP}$`, 'i'),
            userUrl:    new RegExp(`^${USERURL_REGEXP}$`, 'i'),
            link:       new RegExp(`^((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}))$`, 'i'),
            links:      new RegExp(`(^|\\s)((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}(?=[."\'!?:,;]*(?:\\s|$))))`, 'gi')
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
        let links =
            (str.match(this.regexps.links) || []).map(link => { return link.trim(); });

        if (ignoreEmail) {
            let self = this;
            links = links.filter(link => { return !self.looksLikeAnEmail(link); });
        }

        let self = this;
        return links.map(link => { return new LinkClass(link, self.looksLikeAnEmail(link)); });
    }

    replaceLinks (str, callback, context = this) {
        let self = this;
        return str.replace(this.regexps.links, (fullMatch, whitespace, link) => {
            return whitespace + callback.call(context, new LinkClass(link, self.looksLikeAnEmail(link)));
        });
    }

    linky (str, options = {}) {
        let defaults = { ignoreEmail: false, targetBlank: false, protocol: 'http://', operation: {} };
        options = utils.merge(defaults, options);

        let linkTemplate =
            options.targetBlank ?
            '<a href="{{formatted}}" target="_blank">{{displayValue}}</a>' :
            '<a href="{{formatted}}">{{displayValue}}</a>';

        let displayValue;

        return this.replaceLinks(str, (link) => {
            displayValue = link.original;

            if (options.ignoreEmail && link.type == 'email') return displayValue;

            if (typeof link[options.operation.name] == 'function') {
                displayValue = link[options.operation.name].apply(link, options.operation.args);
            }

            if (link.type == 'email') return `<a href="${link.withProtocol()}">${displayValue}</a>`;
            else return linkTemplate.replace('{{formatted}}', link.withProtocol(options.protocol)).replace('{{displayValue}}', displayValue);
        }, this);
    }
}