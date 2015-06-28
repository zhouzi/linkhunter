import LinkHunterClass from '../src/LinkHunterClass';
import subjects from './subjects.json';

let linkHunter;

describe('LinkHunterClass', () => {
    beforeEach(() => {
        linkHunter = new LinkHunterClass();
    });

    describe('linkHunter.looksLikeALink', () => {
        subjects.correct.forEach(str => {
            it(`should return true for ${str}`, () => {
                expect(linkHunter.looksLikeALink(str)).toBe(true);
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
            text = 'Have a look at site.com/whatever and http://www.domain.com/some/sub/path?with=params#hash guys! And say hello@someone.com!';
        });

        it('should extract links from a text', () => {
            expect(JSON.stringify(linkHunter.getLinks(text))).toEqual(JSON.stringify([
                { original: 'site.com/whatever', type: 'url' },
                { original: 'http://www.domain.com/some/sub/path?with=params#hash', type: 'url' },
                { original: 'hello@someone.com', type: 'url' }
            ]));
        });

        it('should replace links by an html anchor tag', () => {
            expect(linkHunter.linky(text)).toBe('Have a look at <a href="http://site.com/whatever">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash">http://www.domain.com/some/sub/path?with=params#hash</a> guys! And say <a href="mailto:hello@someone.com">hello@someone.com</a>!');
        });

        it('should replace links by an html anchor tag and respect options', () => {
            expect(linkHunter.linky(text, { ignoreEmail: true, targetBlank: true, protocol: 'https://' })).toBe('Have a look at <a href="https://site.com/whatever" target="_blank">site.com/whatever</a> and <a href="http://www.domain.com/some/sub/path?with=params#hash" target="_blank">http://www.domain.com/some/sub/path?with=params#hash</a> guys! And say hello@someone.com!');
        });
    });
});