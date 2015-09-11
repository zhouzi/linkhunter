import utils from './utils';

const WRAPPERS             = `(){}"\'`;
const PUNCTUATION_MARK     = `.!?:,;`;
const ENDOFSTRING_REGEXP   = `(?=[${WRAPPERS}${PUNCTUATION_MARK}]*)`;
const STARTOFSTRING_REGEXP = `([\\s${WRAPPERS}${PUNCTUATION_MARK}]*)`;
const NOTRAILING_PUNC_WRAP = `(?:[^\\s]*[^\\s${WRAPPERS}${PUNCTUATION_MARK}])?`;
const DOMAIN_REGEXP        = `(?:[-a-z0-9]{1,255}\\.)+[a-z]{2,10}`;
const EMAIL_REGEXP         = `(?:mailto:)?[^\\s${WRAPPERS}${PUNCTUATION_MARK.substr(1)}]+@${DOMAIN_REGEXP}`;
const REGULARURL_REGEXP    = `https?:\/\/${DOMAIN_REGEXP}(?:/${NOTRAILING_PUNC_WRAP})?`;
const USERURL_REGEXP       = `${DOMAIN_REGEXP}(?:/${NOTRAILING_PUNC_WRAP})?`;

let linkhunter = {
    regexps:  {
        email:      new RegExp(`^${EMAIL_REGEXP}$`, 'i'),
        regularUrl: new RegExp(`^${REGULARURL_REGEXP}$`, 'i'),
        userUrl:    new RegExp(`^${USERURL_REGEXP}$`, 'i'),
        link:       new RegExp(`^((?:${EMAIL_REGEXP})|(?:${REGULARURL_REGEXP})|(?:${USERURL_REGEXP}))$`, 'i'),
        links:      new RegExp(`${STARTOFSTRING_REGEXP}((?:${REGULARURL_REGEXP})|(?:(?:${EMAIL_REGEXP})|(?:${USERURL_REGEXP}))${ENDOFSTRING_REGEXP})`, 'gi')
    },

    looksLikeAnEmail: (str) => {
        return linkhunter.regexps.email.test(str);
    },

    looksLikeALink: (str, includeEmail = false) => {
        if (!includeEmail && linkhunter.looksLikeAnEmail(str)) return false;
        return linkhunter.regexps.link.test(str);
    },

    getLinks: (str, includeEmail = false) => {
        let links = [];
        str.replace(linkhunter.regexps.links, function (match, precedingCharacter, link) { links.push(link); });

        if (!includeEmail) {
            let self = linkhunter;
            links = links.filter(link => { return !self.looksLikeAnEmail(link); });
        }

        return links;
    },

    replaceLinks: (str, callback, context = linkhunter) => {
        return str.replace(linkhunter.regexps.links, (match, precedingCharacter, link) => {
            return precedingCharacter + callback.call(context, link);
        });
    },

    linky: (str, options = {}) => {
        let defaults = {
            ignoreEmail: false,
            target: null,
            protocol: 'http://',
            displayValue: utils.merge({
                cleanUp: false,
                beautify: false,
                shorten: false
            }, options.displayValue || {})
        };

        options = utils.merge(defaults, options);

        let linkTemplate =
            options.target ?
            '<a href="{{formatted}}" target="' + options.target + '">{{displayValue}}</a>' :
            '<a href="{{formatted}}">{{displayValue}}</a>';

        let isEmail;
        let displayValue;
        return linkhunter.replaceLinks(str, (link) => {
            isEmail = linkhunter.looksLikeAnEmail(link);
            if (options.ignoreEmail && isEmail) return link;

            displayValue = link;

            if (options.displayValue.cleanUp)      displayValue = linkhunter.cleanUp(displayValue);
            if (options.displayValue.beautify)     displayValue = linkhunter.beautify(displayValue);
            if (options.displayValue.shorten)      displayValue = linkhunter.shorten(displayValue, options.displayValue.shorten);
            if (options.displayValue.withProtocol) displayValue = linkhunter.withProtocol(displayValue, options.protocol);

            if (isEmail) return `<a href="${linkhunter.withProtocol(link)}">${displayValue}</a>`;
            else return linkTemplate.replace('{{formatted}}', linkhunter.withProtocol(link, options.protocol)).replace('{{displayValue}}', displayValue);
        }, linkhunter);
    },

    hasProtocol: (link) => {
        if (linkhunter.looksLikeAnEmail(link)) return /^mailto:/i.test(link);
        return /^https?:\/\//i.test(link);
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