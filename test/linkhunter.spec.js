import linkhunter from '../src/linkhunter';
import subjects from './subjects.json';

describe('linkhunter', () => {
    describe('linkhunter.looksLikeALink', () => {
        subjects.links.correct.forEach(str => {
            it(`should return true for ${str}`, () => {
                expect(linkhunter.looksLikeALink(str, true)).toBe(true);
            });
        });

        subjects.links.incorrect.forEach(str => {
            it(`should return false for ${str}`, () => {
                expect(linkhunter.looksLikeALink(str)).toBe(false);
            });
        });
    });

    describe('linkhunter.looksLikeAnEmail', () => {
        subjects.emails.correct.forEach(str => {
            it(`should return true for ${str}`, () => {
                expect(linkhunter.looksLikeAnEmail(str)).toBe(true);
            });
        });

        subjects.emails.incorrect.forEach(str => {
            it(`should return false for ${str}`, () => {
                expect(linkhunter.looksLikeAnEmail(str)).toBe(false);
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
            expect(linkhunter.getLinks(text, true)).toEqual([
                'site.com/whatever',
                'http://www.domain.com/some/sub/path?with=params#hash',
                'hello@someone.com',
                'john.doe@domain.more-domain.tld'
            ]);
        });

        it('should replace links by an html anchor tag', () => {
            expect(linkhunter.linky(text)).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say <a href="mailto:hello@someone.com">hello@someone.com</a>! And <a href="mailto:john.doe@domain.more-domain.tld">john.doe@domain.more-domain.tld</a>.\nOh and what about github.com!Let me know what you think.');
        });

        it('should replace links by an html anchor tag and respect options', () => {
            expect(linkhunter.linky(text, { ignoreEmail: true, target: '_blank', protocol: 'https://' })).toBe('Have a look at <a href="https://site.com/whatever" target="_blank">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash" target="_blank">http://www.domain.com/some/sub/path?with=params#hash</a> guys!\nAnd say hello@someone.com! And john.doe@domain.more-domain.tld.\nOh and what about github.com!Let me know what you think.');
        });
    });

    it('should not extract partial urls', () => {
        expect(JSON.stringify(linkhunter.getLinks('Have a look at github.com/angular.js guys!'))).toEqual(JSON.stringify([]));
    });

    it('should not extract partial emails', () => {
        expect(JSON.stringify(linkhunter.getLinks('Say hello@someone.com% '))).toEqual(JSON.stringify([]));
    });

    it('should extract urls that are followed by a punctuation mark', () => {
        expect(linkhunter.getLinks('Have a look at github.com! site.com.')).toEqual(['github.com', 'site.com']);
    });

    it('should call a callback for each links found in a string', () => {
        let str = linkhunter.replaceLinks('Have a look at site.com and http://whatever.com/ guys! hello@someone.com', link => {
            return 'REPLACEMENT';
        });

        expect(str).toBe('Have a look at REPLACEMENT and REPLACEMENT guys! REPLACEMENT');
    });

    it('should detect if an url has a protocol or not', () => {
        expect(linkhunter.hasProtocol('site.com')).toBe(false);
        expect(linkhunter.hasProtocol('http://site.com')).toBe(true);
        expect(linkhunter.hasProtocol('https://site.com')).toBe(true);
        expect(linkhunter.hasProtocol('email@domain.com')).toBe(false);
        expect(linkhunter.hasProtocol('mailto:email@domain.com')).toBe(true);
    });

    it('should add a protocol if needed', () => {
        expect(linkhunter.withProtocol('site.com')).toBe('http://site.com');
        expect(linkhunter.withProtocol('site.com', 'https://')).toBe('https://site.com');

        expect(linkhunter.withProtocol('http://site.com')).toBe('http://site.com');
        expect(linkhunter.withProtocol('https://site.com')).toBe('https://site.com');

        expect(linkhunter.withProtocol('hello@someone.com')).toBe('mailto:hello@someone.com');
        expect(linkhunter.withProtocol('hello@someone.com', 'http://')).toBe('mailto:hello@someone.com');
        expect(linkhunter.withProtocol('hello@someone.com', 'https://')).toBe('mailto:hello@someone.com');
    });

    it('should cleanup original link', () => {
        expect(linkhunter.cleanUp('http://site.com?some=params')).toBe('site.com?some=params');
        expect(linkhunter.cleanUp('http://site.com?some=params', true)).toBe('site.com');
        expect(linkhunter.cleanUp('http://site.com/', true)).toBe('site.com');
        expect(linkhunter.cleanUp('http://site.com/#', true)).toBe('site.com');
    });

    it('should shorten a link', () => {
        expect(linkhunter.shorten('http://site.com/some/path', 12)).toBe('http://si...');
        expect(linkhunter.shorten('http://site.com/some/path', 99)).toBe('http://site.com/some/path');
    });

    it('should beautify a link', () => {
        expect(linkhunter.beautify('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash')).toBe('site.com/.../article-title');
        expect(linkhunter.beautify('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash', false)).toBe('site.com/.../article-title?utf8&some=tracker#hash');
    });
});