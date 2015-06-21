import LinkHunterClass from '../src/LinkHunterClass';

let linkHunter;
let text;
let correctCandidates;
let wrongCandidates;

describe('linkHunter', () => {
    beforeEach(() => {
        linkHunter = new LinkHunterClass();

        text =
            'This is just some text. Its purpose is to test linkHunter. ' +
            'So for example here is a link: http://site.com/ ' +
            'linkHunter is so powerful than event site.com can be found. ' +
            'Actually, the majority of people often omit the http:// protocol when sharing an url. ' +
            'Oh and it also find emails such as user@email.com :) ' +
            'Be aware that user@email.com. or site.com. won\'t be matched because of the dot ' +
            'Here is a perfectly valid link: http://site.com/some/path/?foo=bar#hash ' +
            'Works also in the form of: site.com/some/path/?foo=bar#hash '
        ;

        correctCandidates = [
            'http://site.com/path-to-some-url/with-params-0123467890?foo=bar&wquz=foo#some-section',
            'https://site.com/path-to-some-url/with-params-0123467890?foo=bar&wquz=foo#some-section',
            'site.com/path-to-some-url/with-params-0123467890?foo=bar&wquz=foo#some-section',
            's.co'
        ];

        wrongCandidates = ['a.c', 'something..hello', 'whatever...com', 'user@email.com'];
    });

    it('should check correct candidates', () => {
        correctCandidates.forEach(candidate => {
            expect(linkHunter.isLink(candidate)).toBe(true);
        });
    });

    it('should check wrong candidates', () => {
        wrongCandidates.forEach(candidate => {
            expect(linkHunter.isLink(candidate)).toBe(false);
        });
    });

    it('should extract links from a text', () => {
        expect(JSON.stringify(linkHunter.getLinks(text, false))).toEqual(JSON.stringify([
            { original: 'http://site.com/', type:  'url' },
            { original: 'site.com', type:  'url' },
            { original: 'user@email.com', type:  'email' },
            { original: 'http://site.com/some/path/?foo=bar#hash', type:  'url' },
            { original: 'site.com/some/path/?foo=bar#hash', type:  'url' }
        ]));
    });

    it('should replace links by html link tags', () => {
        expect(linkHunter.linkify('Have a look at site.com guys!')).toBe('Have a look at <a href="http://site.com">site.com</a> guys!');
    });

    it('should linkify emails as well', () => {
        expect(linkHunter.linkify('Feel free to say hello@gabinaureche.com!')).toBe('Feel free to say <a href="mailto:hello@gabinaureche.com">hello@gabinaureche.com</a>!');
    });

    it('should not linkify emails if ignoreEmail option is true', () => {
        expect(linkHunter.linkify('Feel free to say hello@gabinaureche.com!', { ignoreEmail: true })).toBe('Feel free to say hello@gabinaureche.com!');
    });

    it('should add target blank in linkify if specified', () => {
        expect(linkHunter.linkify('Have a look at site.com guys!', { targetBlank: true })).toBe('Have a look at <a href="http://site.com" target="_blank">site.com</a> guys!');
    });
});
