import LinkClass from './LinkClass';
import utils from './utils';

const ENDOFSTRING_REGEXP = `(?=[."\'!?:,;]*(?:\\s|$))`;
const DOMAIN_REGEXP      = `(?:[-a-z0-9]{1,255}\\.)+[a-z]{2,10}`;
const EMAIL_REGEXP       = `[^\\s]+@${DOMAIN_REGEXP}`;
const REGULARURL_REGEXP  = `https?:\/\/${DOMAIN_REGEXP}[^\\s]*`;
const USERURL_REGEXP     = `${DOMAIN_REGEXP}[^.\\s"\'!?:,;]*`;

export default class LinkHunterClass {
    constructor () {
        this.regexps =  {
            email:      new RegExp(`^${EMAIL_REGEXP}$`, 'i'),
            regularUrl: new RegExp(`^${REGULARURL_REGEXP}$`, 'i'),
            userUrl:    new RegExp(`^${USERURL_REGEXP}$`, 'i'),
            link:       new RegExp(`^((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}))$`, 'i'),
            links:      new RegExp(`(^|\\s)((?:${REGULARURL_REGEXP})|(?:(?:${EMAIL_REGEXP}|(?:${USERURL_REGEXP}))${ENDOFSTRING_REGEXP}))`, 'gi')
        };
    }

    looksLikeAnEmail (str) {
        return this.regexps.email.test(str);
    }

    looksLikeALink (str, includeEmail = false) {
        if (!includeEmail && this.looksLikeAnEmail(str)) return false;
        return this.regexps.link.test(str);
    }

    getLinks (str, includeEmail = false) {
        let links =
            (str.match(this.regexps.links) || []).map(link => { return link.trim(); });

        if (!includeEmail) {
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
        let defaults = { ignoreEmail: false, target: null, protocol: 'http://', operation: {} };
        options = utils.merge(defaults, options);

        let linkTemplate =
            options.target ?
            '<a href="{{formatted}}" target="' + options.target + '">{{displayValue}}</a>' :
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