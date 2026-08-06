export interface TextSegment {
  text: string
  match: boolean
}

/**
 * Splits `text` into segments around case-insensitive occurrences of `query`,
 * for highlighting search matches. Returns the whole text as one non-matching
 * segment when the query is blank.
 */
export function getHighlightSegments(text: string, query: string): TextSegment[] {
  const trimmed = query.trim()
  if (!trimmed) return [{ text, match: false }]

  const lowerText = text.toLowerCase()
  const lowerQuery = trimmed.toLowerCase()
  const segments: TextSegment[] = []
  let i = 0

  while (i < text.length) {
    const idx = lowerText.indexOf(lowerQuery, i)
    if (idx === -1) {
      segments.push({ text: text.slice(i), match: false })
      break
    }
    if (idx > i) segments.push({ text: text.slice(i, idx), match: false })
    segments.push({ text: text.slice(idx, idx + trimmed.length), match: true })
    i = idx + trimmed.length
  }

  return segments
}
