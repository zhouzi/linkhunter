export default (link, maxLength = Infinity) => {
  if (link.length <= maxLength) {
    return link;
  }

  const ellipsis = '...';
  return `${link.substr(0, maxLength - ellipsis.length)}${ellipsis}`;
}
