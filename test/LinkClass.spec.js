import LinkClass from '../src/LinkClass.js';

let testLink;
let shortenedLink;

describe('LinkClass', () => {
    beforeEach(() => {
        testLink = new LinkClass('http://site.com/some/path/to/whatever-the-title-could-be');
    });

    it('should build a basic link object', () => {
        expect(new LinkClass('site.com').toString()).toEqual({ original: 'site.com', type: 'url' }.toString());
        expect(new LinkClass('user@email.com').toString()).toEqual({ original: 'user@email.com', type: 'email' }.toString());
    });

    it('should remove protocol when shortening a link', () => {
        shortenedLink = testLink.shorten(20);
        expect(shortenedLink.indexOf('http://')).toBe(-1);
        expect(shortenedLink.length <= 20).toBe(true);
    });

    it('should shorten links that have no sub path', () => {
        expect(new LinkClass('site.com').shorten(100)).toBe('site.com');
        expect(new LinkClass('whatever.the.site.could.be').shorten(20)).toBe('whatever.the.site...');
    });

    it('should strictly shorten a link', () => {
        shortenedLink = testLink.shorten(20);
        expect(shortenedLink).toBe('site.com/.../what...');
        expect(shortenedLink.length <= 20).toBe(true);
    });

    it('should return the link as is if its length is not greater than the max length', () => {
        shortenedLink = testLink.shorten(100);
        expect(shortenedLink).toBe('http://site.com/some/path/to/whatever-the-title-could-be');
        expect(shortenedLink.length <= 100).toBe(true);
    });

    it('should remove the protocol if the link length is greater than the max length', () => {
        shortenedLink = testLink.shorten(49);
        expect(shortenedLink).toBe('site.com/some/path/to/whatever-the-title-could-be');
        expect(shortenedLink.length <= 49).toBe(true);
    });

    it('should nicely shorten a link', () => {
        expect(testLink.shorten(20, false)).toBe('site.com/.../whatever-the-title-could-be');
        expect(new LinkClass('http://site.com/some/path/to/whatever-the-title-could-be/').shorten(20, false)).toBe('site.com/.../whatever-the-title-could-be');
    });

    it('should return urls with a protocol', () => {
        expect(new LinkClass('site.com').toFormatted('https://')).toBe('https://site.com');
        expect(new LinkClass('http://site.com').toFormatted('https://')).toBe('http://site.com');
        expect(new LinkClass('user@email.com').toFormatted('https://')).toBe('user@email.com');
    });

    it('should beautify an url', () => {
        expect(new LinkClass('site.com').beautify()).toBe('site.com');
        expect(new LinkClass('site.com/some/path/to/article/some-random-title').beautify()).toBe('site.com/.../some-random-title');
        expect(new LinkClass('site.com/some/path/to/article/some-random-title/').beautify()).toBe('site.com/.../some-random-title');
    });

    it('should clean up a link', () => {
        expect(LinkClass.cleanUp('http://site.com/')).toBe('site.com');
        expect(LinkClass.cleanUp('http://site.com/#')).toBe('site.com');
        expect(LinkClass.cleanUp('http://site.com/?some=params')).toBe('site.com/?some=params');
        expect(LinkClass.cleanUp('http://site.com/?some=params', true)).toBe('site.com');
    });
});
