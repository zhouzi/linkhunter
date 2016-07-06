import { email } from './regexps';
export default str => email.test(str);
