import emailish from './emailish';
import cleanUp from './cleanUp';

export default (link, removeQueryParams = true) => {
  if (emailish(link)) {
    return link;
  }

  link = cleanUp(link, removeQueryParams);

  // if there is no sub paths e.g. site.com
  if (link.indexOf('/') < 0) {
    return link;
  }

  const fragments = link.split('/');
  if (fragments.length > 2) {
    return `${fragments.shift()}/.../${fragments.pop()}`;
  }

  return `${fragments.shift()}/${fragments.pop()}`;
}
