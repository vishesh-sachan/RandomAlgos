# Markdown to TSX Conversion Guide

This guide explains how to convert only the body content from the markdown draft into the TSX format used in [src/contents/Tango.tsx](src/contents/Tango.tsx). The conversion starts after the post content comment and does not include the article shell, header, title, or metadata.

## Scope

Convert only the content that appears inside the body wrapper in Tango.tsx:

```tsx
<div className="flex flex-col gap-6 text-gray-300 leading-8">
  {/* post content  */}
  ...
</div>
```

Leave the outer structure, imports, title, date, author, and CTA placement unchanged.

## What To Convert

### 1. Paragraphs

Convert every normal markdown paragraph into a `<p>` block.

```md
So naturally I wasted days doing exactly that.
```

```tsx
<p>
  So naturally I wasted days doing exactly that.
</p>
```

Keep paragraph breaks from the markdown. Do not merge separate ideas into one paragraph.

### 2. Quotes

Convert markdown blockquotes into the same TSX quote style used in Tango.tsx.

```md
> Hmm... can I write a program that solves this?
```

```tsx
<blockquote className="border-l-2 border-white pl-4 italic text-gray-300">
  Hmm... can I write a program that solves this?
</blockquote>
```

### 3. Headings

Convert section headings into the existing heading components:

```md
## Understanding The Game
### My Hand Drawn Illustration
```

```tsx
<H1 text="Understanding The Game" />
<H2 text="My Hand Drawn Illustration" />
```

Use `H1` for major sections and `H2` for smaller subsections. Keep the heading text exactly as it appears in the markdown.

### 4. Horizontal Rules

Convert markdown horizontal rules into the divider used in Tango.tsx.

```md
---
```

```tsx
<hr className='border-gray-300' />
```

Use this before and after major sections when the markdown uses separators.

### 5. Lists

Convert unordered lists to `<ul>` and ordered lists to `<ol>`.

```md
* Sun = 0
* Moon = 1
```

```tsx
<ul className="list-disc list-inside space-y-2">
  <li>Sun = 0</li>
  <li>Moon = 1</li>
</ul>
```

For ordered lists, use the matching ordered list structure:

```tsx
<ol className="list-decimal list-inside space-y-2">
  <li>First step</li>
  <li>Second step</li>
</ol>
```

### 6. Code Blocks

Use `CodeBlock` for code snippets.

If the code is short and written directly in the markdown, place it inline in the component:

```tsx
<CodeBlock
  filename="tuples"
  language="python"
  code={`(0,0)
(2,1)
(4,5)`}
/>
```

If the code is larger or reused, keep it in `tango-code.ts` and import it into Tango.tsx, then pass it to `CodeBlock`.

```tsx
<CodeBlock
  filename="board"
  language="python"
  code={boardCode}
/>
```

Rule of thumb:

1. Small example code can be written directly in the TSX file.
2. Larger code samples should live in `tango-code.ts`.
3. Preserve indentation and line breaks exactly.

### 7. Images

When the markdown uses a heading such as `### My Hand Drawn Illustration`, convert that section into an image block in the same format already shown in Tango.tsx.

Start with the image example wrapper:

```tsx
<div>
  <img src="" alt="" style={{ width: 'auto', height: 'auto' }} />
  <p className="text-xs text-gray-400 uppercase tracking-wide">
    {caption}
  </p>
</div>
```

Then fill in the image source, alt text, and caption for the specific illustration.

## Conversion Rules

1. Only convert the body content after the post content comment.
2. Leave the article wrapper and header untouched.
3. Use `p` for normal text.
4. Use the quote block style for markdown blockquotes.
5. Use `H1` and `H2` for headings.
6. Use `hr` for separators.
7. Use `ul` and `ol` for lists.
8. Use `CodeBlock` for code, and move larger code into `tango-code.ts`.
9. Convert `### My Hand Drawn Illustration` into an image block using the same structure as the image example in Tango.tsx.

## Quick Checklist

Before calling the conversion done, check that the body:

1. Contains no raw markdown syntax like `##`, `>`, or `---`.
2. Uses the same spacing and block structure as the Tango body.
3. Keeps code examples readable and split between direct code and imported snippets when needed.
4. Uses the image wrapper format for illustration sections.

## Example Pattern

Markdown:

```md
## First Thoughts

Whenever I see a grid my brain immediately goes:

> 2D array.

### My Hand Drawn Illustration
```

TSX:

```tsx
<H1 text="First Thoughts" />

<p>
  Whenever I see a grid my brain immediately goes:
</p>

<blockquote className="border-l-2 border-white pl-4 italic text-gray-300">
  2D array.
</blockquote>

<div>
  <img src="" alt="" style={{ width: 'auto', height: 'auto' }} />
  <p className="text-xs text-gray-400 uppercase tracking-wide">
    {caption}
  </p>
</div>
```