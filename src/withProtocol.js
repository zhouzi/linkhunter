import emailish from './emailish';
import hasProtocol from './hasProtocol';

export default (link, protocol = 'http://') => {
  if (hasProtocol(link)) {
    return link;
  }

  if (emailish(link)) {
    return `mailto:${link}`;
  }

  return `${protocol}${link}`;
};
