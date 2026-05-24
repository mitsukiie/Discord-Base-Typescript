import type { TextInput, TextStyleOptions } from '../types';

function surround(content: string, marker: string) {
  return `${marker}${content}${marker}`;
}

function getCodeFence(content: string) {
  let maxRun = 0;
  let run = 0;

  for (const character of content) {
    if (character === '`') {
      run += 1;
      if (run > maxRun) maxRun = run;
      continue;
    }

    run = 0;
  }

  return '`'.repeat(maxRun + 1);
}

/**
 * Normalizes a text input into an array of lines.
 *
 * @param input Text input.
 * @returns Normalized lines.
 */
export function toLines(input: TextInput) {
  return Array.isArray(input) ? input : [input];
}

/**
 * Formats one or more lines using a per-line mapper.
 *
 * @param input Text input.
 * @param formatter Line formatter.
 * @returns Formatted markdown text.
 */
export function formatLines(
  input: TextInput,
  formatter: (line: string, index: number) => string,
) {
  return toLines(input)
    .map((line, index) => formatter(line, index))
    .join('\n');
}

/**
 * Applies markdown formatting to a text payload.
 *
 * @param content Raw text content.
 * @param options Formatting options.
 * @returns Markdown-formatted text.
 */
export function formatText(content: TextInput, options: TextStyleOptions = {}) {
  let out = toLines(content).join('\n');

  if (options.underline) out = surround(out, '__');
  if (options.italic) out = surround(out, '*');
  if (options.bold) out = surround(out, '**');

  if (typeof options.size === 'number') {
    const prefix = options.size === 4 ? '-#' : '#'.repeat(options.size);
    return `${prefix} ${out}`;
  }

  return out;
}

/**
 * Wraps text in inline-code markdown.
 *
 * @param content Raw text content.
 * @returns Inline-code markdown.
 */
export function formatInlineCode(content: TextInput) {
  const text = toLines(content).join('\n');
  const fence = getCodeFence(text);
  return `${fence}${text}${fence}`;
}

/**
 * Formats a markdown quote block.
 *
 * @param input Quote content.
 * @returns Markdown quote text.
 */
export function formatQuote(input: TextInput) {
  return formatLines(input, (line) => `> ${line}`);
}

/**
 * Formats a markdown spoiler block.
 *
 * @param input Spoiler content.
 * @returns Markdown spoiler text.
 */
export function formatSpoiler(input: TextInput) {
  return formatLines(input, (line) => `||${line}||`);
}
