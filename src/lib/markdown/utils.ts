export function fixUnclosedTags(text: string) {
  const tagRegex = /<[^\s<>]+>/g;
  const tags = text.match(tagRegex);
  if (tags && !tags[tags.length - 1].startsWith('</'))
    return text + `</${tags[tags.length - 1].slice(1)}`
  return text
}
