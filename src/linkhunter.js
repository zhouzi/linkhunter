import utils from './utils';

const ENDOFSTRING_REGEXP = `(?=[."\'!?:,;]*(?:\\s|$))`;
const DOMAIN_REGEXP      = `(?:[-a-z0-9]{1,255}\\.)+[a-z]{2,10}`;
const EMAIL_REGEXP       = `[^\\s]+@${DOMAIN_REGEXP}`;
const REGULARURL_REGEXP  = `https?:\/\/${DOMAIN_REGEXP}[^\\s]*`;
const USERURL_REGEXP     = `${DOMAIN_REGEXP}[^.\\s"\'!?:,;]*`;

let linkhunter = {
    regexps:  {
        email:      new RegExp(`^${EMAIL_REGEXP}$`, 'i'),
        regularUrl: new RegExp(`^${REGULARURL_REGEXP}$`, 'i'),
        userUrl:    new RegExp(`^${USERURL_REGEXP}$`, 'i'),
        link:       new RegExp(`^((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}))$`, 'i'),
        links:      new RegExp(`(^|\\s)((?:${REGULARURL_REGEXP})|(?:(?:${EMAIL_REGEXP}|(?:${USERURL_REGEXP}))${ENDOFSTRING_REGEXP}))`, 'gi')
    },

    looksLikeAnEmail: (str) => {
        return linkhunter.regexps.email.test(str);
    },

    looksLikeALink: (str, includeEmail = false) => {
        if (!includeEmail && linkhunter.looksLikeAnEmail(str)) return false;
        return linkhunter.regexps.link.test(str);
    },

    getLinks: (str, includeEmail = false) => {
        let links =
            (str.match(linkhunter.regexps.links) || []).map(link => { return link.trim(); });

        if (!includeEmail) {
            let self = linkhunter;
            links = links.filter(link => { return !self.looksLikeAnEmail(link); });
        }

        return links;
    },

    replaceLinks: (str, callback, context = linkhunter) => {
        return str.replace(linkhunter.regexps.links, (fullMatch, whitespace, link) => {
            return whitespace + callback.call(context, link);
        });
    },

    linky: (str, options = {}) => {
        let defaults = { ignoreEmail: false, target: null, protocol: 'http://' };
        options = utils.merge(defaults, options);

        let linkTemplate =
            options.target ?
            '<a href="{{formatted}}" target="' + options.target + '">{{displayValue}}</a>' :
            '<a href="{{formatted}}">{{displayValue}}</a>';

        let isEmail;
        return linkhunter.replaceLinks(str, (link) => {
            isEmail = linkhunter.looksLikeAnEmail(link);
            if (options.ignoreEmail && isEmail) return link;

            if (isEmail) return `<a href="${linkhunter.withProtocol(link)}">${link}</a>`;
            else return linkTemplate.replace('{{formatted}}', linkhunter.withProtocol(link, options.protocol)).replace('{{displayValue}}', link);
        }, linkhunter);
    },

    hasProtocol: (link) => {
        if (linkhunter.looksLikeAnEmail(link)) return /^mailto:/.test(link);
        return /^https?:\/\//.test(link);
    },

    withProtocol: (link, protocol = 'http://') => {
        if (linkhunter.looksLikeAnEmail(link)) protocol = 'mailto:';
        return linkhunter.hasProtocol(link) ? link : protocol + link;
    },

    cleanUp: (link, removeQueryParams = false) => {
        if (removeQueryParams) {
            var indexOfQueryParams = link.lastIndexOf('?');
            if (indexOfQueryParams >= 0) link = link.substr(0, indexOfQueryParams);
        }

        link = link.replace(/^https?:\/\//, '').replace(/\/#?$/, '');

        return link;
    },

    shorten: (link, maxLength) => {
        return utils.addEllipsis(link, maxLength);
    },

    beautify: (link, removeQueryParams = true) => {
        if (linkhunter.looksLikeAnEmail(link)) return link;

        link = linkhunter.cleanUp(link, removeQueryParams);

        // if there is no sub path e.g. site.com
        if (link.indexOf('/') < 0) return link;

        let fragments = link.split('/');

        if (fragments.length > 2) return fragments.shift() + '/.../' + fragments.pop();
        else return fragments.shift() + '/' + fragments.pop();
    }
};

export default linkhunter;