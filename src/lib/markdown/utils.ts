export function fixUnclosedTags(text: string) {
  const tagRegex = /<[^\s<>]+>/g
  const tags = text.match(tagRegex)
  if (tags) {
    if (tags[0].startsWith('<think>')
      && !tags.includes('</think>')) {
      return text + `</think>`
    } else if (!tags[tags.length - 1].startsWith('</')) {
      return text + `</${tags[tags.length - 1].slice(1)}`
    }
  }
  return text
}
