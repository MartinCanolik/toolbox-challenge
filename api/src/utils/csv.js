const HEX_32_REGEX = /^[0-9a-f]{32}$/i

/**
 * Parses a raw CSV string and returns only valid lines.
 * A line is valid if it has exactly 4 fields (file, text, number, hex),
 * text is non-empty, number is numeric, and hex is 32 hex chars.
 * The header line (file,text,number,hex) is always skipped.
 *
 * @param {string} raw - raw CSV content
 * @returns {{ file: string, text: string, number: number, hex: string }[]}
 */
function parseAndValidate (raw) {
  const lines = raw.split('\n').map(line => line.replace(/\r$/, ''))
  const results = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (i === 0 || line === '') continue

    const parts = line.split(',')

    if (parts.length !== 4) continue

    const [file, text, numberStr, hex] = parts

    if (!file || !text) continue
    if (!HEX_32_REGEX.test(hex)) continue

    const numberVal = Number(numberStr)
    if (numberStr.trim() === '' || isNaN(numberVal)) continue

    results.push({
      file: file.trim(),
      text: text.trim(),
      number: numberVal,
      hex: hex.trim()
    })
  }

  return results
}

module.exports = { parseAndValidate }
