import LinkClass from '../src/LinkClass.js';

describe('LinkClass', () => {
    it('should build a link object', () => {
        expect(JSON.stringify(new LinkClass('site.com'))).toBe(JSON.stringify({ original: 'site.com', type: 'url' }));
        expect(JSON.stringify(new LinkClass('email@domain.com', true))).toBe(JSON.stringify({ original: 'email@domain.com', type: 'email' }));
    });

    it('should detect if original link has a protocol or not', () => {
        expect(new LinkClass('site.com').originalHasProtocol()).toBe(false);
        expect(new LinkClass('http://site.com').originalHasProtocol()).toBe(true);
        expect(new LinkClass('https://site.com').originalHasProtocol()).toBe(true);
    });

    it('should add a protocol if needed', () => {
        expect(new LinkClass('site.com').withProtocol()).toBe('http://site.com');
        expect(new LinkClass('site.com').withProtocol('https://')).toBe('https://site.com');

        expect(new LinkClass('http://site.com').withProtocol()).toBe('http://site.com');
        expect(new LinkClass('https://site.com').withProtocol()).toBe('https://site.com');
    });

    it('should cleanup original link', () => {
        expect(new LinkClass('http://site.com?some=params').cleanUp()).toBe('site.com?some=params');
        expect(new LinkClass('http://site.com?some=params').cleanUp(true)).toBe('site.com');
        expect(new LinkClass('http://site.com/').cleanUp(true)).toBe('site.com');
        expect(new LinkClass('http://site.com/#').cleanUp(true)).toBe('site.com');
    });

    it('should shorten a link', () => {
        expect(new LinkClass('http://site.com/some/path').shorten(12)).toBe('site.com/...');
        expect(new LinkClass('http://site.com/some/path').shorten(99)).toBe('http://site.com/some/path');
    });

    it('should beautify a link', () => {
        expect(new LinkClass('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash').beautify()).toBe('site.com/.../article-title');
        expect(new LinkClass('http://site.com/some/sub/path/to/article-title?utf8&some=tracker#hash').beautify(false)).toBe('site.com/.../article-title?utf8&some=tracker#hash');
    });
});