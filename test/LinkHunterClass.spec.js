import LinkHunterClass from '../src/LinkHunterClass';
import LinkClass from '../src/LinkClass';
import subjects from './subjects.json';

let linkHunter;

describe('LinkHunterClass', () => {
    beforeEach(() => {
        linkHunter = new LinkHunterClass();
    });

    describe('linkHunter.looksLikeALink', () => {
        subjects.correct.forEach(str => {
            it(`should return true for ${str}`, () => {
                expect(linkHunter.looksLikeALink(str, true)).toBe(true);
            });
        });

        subjects.incorrect.forEach(str => {
            it(`should return false for ${str}`, () => {
                expect(linkHunter.looksLikeALink(str)).toBe(false);
            });
        });
    });

    describe('Manipulating strings', () => {
        let text;
        beforeEach(() => {
            text =
                [
                    'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys!',
                    'And say hello@someone.com! And john.doe@domain.more-domain.tld.',
                    'Oh and what about github.com!Let me know what you think.'
                ].join('\n');
        });

        it('should extract links from a text', () => {
            expect(JSON.stringify(linkHunter.getLinks(text, true))).toEqual(JSON.stringify([
                { original: 'site.com/whatever', type: 'url', originalHasProtocol: false },
                { original: 'http://www.domain.com/some/sub/path?with=params#hash', type: 'url', originalHasProtocol: true },
                { original: 'hello@someone.com', type: 'email', originalHasProtocol: false },
                { original: 'john.doe@domain.more-domain.tld', type: 'email', originalHasProtocol: false }
            ]));
        });

        it('should replace links by an html anchor tag', () => {
            expect(linkHunter.linky(text)).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.\nOh and what about github.com!Let me know what you think.');
        });

        it('should replace links by an html anchor tag and respect options', () => {
            expect(linkHunter.linky(text, { ignoreEmail: true, target: '_blank', protocol: 'https://' })).toBe('Have a look at <a href="https://site.com/whatever" target="_blank">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash" target="_blank">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say hello@someone.com! And john.doe@domain.more-domain.tld.\nOh and what about github.com!Let me know what you think.');
        });

        it('should perform an operation on links\' display value', () => {
            expect(linkHunter.linky(text, { operation: { name: 'cleanUp', args: [true] } })).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">www.domain.com/some/sub/path</a> guys!\nAnd say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.\nOh and what about github.com!Let me know what you think.');
            expect(linkHunter.linky(text, { operation: { name: 'beautify', args: [true] } })).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">www.domain.com/.../path</a> guys!\nAnd say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.\nOh and what about github.com!Let me know what you think.');
        });
    });

    it('should not extract partial urls', () => {
        expect(JSON.stringify(linkHunter.getLinks('Have a look at github.com/angular.js guys!'))).toEqual(JSON.stringify([]));
    });

    it('should not extract partial emails', () => {
        expect(JSON.stringify(linkHunter.getLinks('Say hello@someone.com% '))).toEqual(JSON.stringify([]));
    });

    it('should extract urls that are followed by a punctuation mark', () => {
        expect(JSON.stringify(linkHunter.getLinks('Have a look at github.com! site.com.'))).toEqual(JSON.stringify([{ original: 'github.com', type: 'url', originalHasProtocol: false }, { original: 'site.com', type: 'url', originalHasProtocol: false }]));
    });

    it('should call a callback for each links found in a string', () => {
        let str = linkHunter.replaceLinks('Have a look at site.com and http://whatever.com/ guys! hello@someone.com', link => {
            expect(link instanceof LinkClass).toBe(true);
            return 'REPLACEMENT';
        });

        expect(str).toBe('Have a look at REPLACEMENT and REPLACEMENT guys! REPLACEMENT');
    });
});