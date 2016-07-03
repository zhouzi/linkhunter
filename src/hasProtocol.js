import emailish from './emailish';
export default link => emailish(link) ? /^mailto:/i.test(link) : /^https?:\/\//i.test(link);
