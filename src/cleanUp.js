export default (link, removeQueryParams = false) => {
  if (removeQueryParams) {
    const indexOfQueryParams = link.lastIndexOf('?');

    if (indexOfQueryParams >= 0) {
      link = link.substr(0, indexOfQueryParams);
    }
  }

  link = link.replace(/^https?:\/\//i, '').replace(/\/#?$/, '');
  return link;
};
