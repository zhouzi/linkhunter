import isEmailish from './isEmailish';
import hasProtocol from './hasProtocol';

export default (link, protocol = 'http://') => {
  if (hasProtocol(link)) {
    return link;
  }

  if (isEmailish(link)) {
    return `mailto:${link}`;
  }

  return `${protocol}${link}`;
};
