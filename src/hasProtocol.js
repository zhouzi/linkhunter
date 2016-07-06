import isEmailish from './isEmailish';
export default link => isEmailish(link) ? /^mailto:/i.test(link) : /^https?:\/\//i.test(link);
