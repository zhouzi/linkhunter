import withProtocol from './withProtocol';
export default link => `<a href="${withProtocol(link)}">${link}</a>`;
