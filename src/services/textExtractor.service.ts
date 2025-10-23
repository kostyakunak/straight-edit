interface TextElement {
  elementType: string;
  originalText: string;
  contextPath: string;
  lineNumber: number;
  startPosition: number;
  endPosition: number;
}

export class TextExtractorService {
  extractTextElements(content: string, fileType: string): TextElement[] {
    const elements: TextElement[] = [];

    if (fileType === 'html') {
      return this.extractFromHTML(content);
    } else if (['jsx', 'tsx', 'js', 'ts'].includes(fileType)) {
      return this.extractFromJSX(content);
    }

    return elements;
  }

  private extractFromHTML(content: string): TextElement[] {
    const elements: TextElement[] = [];
    const lines = content.split('\n');

    const textPatterns = [
      { pattern: /<h[1-6][^>]*>(.*?)<\/h[1-6]>/g, type: 'heading' },
      { pattern: /<p[^>]*>(.*?)<\/p>/g, type: 'paragraph' },
      { pattern: /<button[^>]*>(.*?)<\/button>/g, type: 'button' },
      { pattern: /<a[^>]*>(.*?)<\/a>/g, type: 'link' },
      { pattern: /<label[^>]*>(.*?)<\/label>/g, type: 'label' },
      { pattern: /<span[^>]*>(.*?)<\/span>/g, type: 'span' },
      { pattern: /<div[^>]*>(.*?)<\/div>/g, type: 'div' },
      { pattern: /<li[^>]*>(.*?)<\/li>/g, type: 'list-item' },
      { pattern: /title="([^"]*)"/g, type: 'attribute-title' },
      { pattern: /alt="([^"]*)"/g, type: 'attribute-alt' },
      { pattern: /placeholder="([^"]*)"/g, type: 'attribute-placeholder' },
    ];

    let globalPosition = 0;
    lines.forEach((line, lineIndex) => {
      textPatterns.forEach(({ pattern, type }) => {
        const regex = new RegExp(pattern);
        let match;

        while ((match = regex.exec(line)) !== null) {
          const text = match[1].trim();
          if (text && !this.isCodeOrVariable(text)) {
            const startPos = globalPosition + match.index;
            const endPos = startPos + match[0].length;

            elements.push({
              elementType: type,
              originalText: text,
              contextPath: this.generateContextPath(line, type),
              lineNumber: lineIndex + 1,
              startPosition: startPos,
              endPosition: endPos,
            });
          }
        }
      });
      globalPosition += line.length + 1;
    });

    return elements;
  }

  private extractFromJSX(content: string): TextElement[] {
    const elements: TextElement[] = [];
    const lines = content.split('\n');

    const textPatterns = [
      { pattern: /<h[1-6][^>]*>(.*?)<\/h[1-6]>/g, type: 'heading' },
      { pattern: /<p[^>]*>(.*?)<\/p>/g, type: 'paragraph' },
      { pattern: /<button[^>]*>(.*?)<\/button>/g, type: 'button' },
      { pattern: /<a[^>]*>(.*?)<\/a>/g, type: 'link' },
      { pattern: /<label[^>]*>(.*?)<\/label>/g, type: 'label' },
      { pattern: /<span[^>]*>(.*?)<\/span>/g, type: 'span' },
      { pattern: /<div[^>]*className="[^"]*"[^>]*>(.*?)<\/div>/g, type: 'div' },
      { pattern: /<li[^>]*>(.*?)<\/li>/g, type: 'list-item' },
      { pattern: /title="([^"]*)"/g, type: 'attribute-title' },
      { pattern: /alt="([^"]*)"/g, type: 'attribute-alt' },
      { pattern: /placeholder="([^"]*)"/g, type: 'attribute-placeholder' },
      { pattern: />\s*{['"`]([^'"`{}<>]+)['"`]}\s*</g, type: 'jsx-text' },
      { pattern: />\s*(['"`])([^'"`{}<>]+)\1\s*</g, type: 'jsx-string' },
    ];

    let globalPosition = 0;
    lines.forEach((line, lineIndex) => {
      textPatterns.forEach(({ pattern, type }) => {
        const regex = new RegExp(pattern);
        let match;

        while ((match = regex.exec(line)) !== null) {
          const text = (match[1] || match[2] || '').trim();
          if (text && !this.isCodeOrVariable(text) && text.length > 1) {
            const startPos = globalPosition + match.index;
            const endPos = startPos + match[0].length;

            elements.push({
              elementType: type,
              originalText: text,
              contextPath: this.generateContextPath(line, type),
              lineNumber: lineIndex + 1,
              startPosition: startPos,
              endPosition: endPos,
            });
          }
        }
      });
      globalPosition += line.length + 1;
    });

    return elements;
  }

  private isCodeOrVariable(text: string): boolean {
    const codePatterns = [
      /^[a-z][a-zA-Z0-9_]*$/,
      /^\{.*\}$/,
      /^\[.*\]$/,
      /^[\d.]+$/,
      /^function\s/,
      /^const\s/,
      /^let\s/,
      /^var\s/,
      /^import\s/,
      /^export\s/,
      /^return\s/,
      /^className=/,
      /^[<>{}[\]()]/,
    ];

    return codePatterns.some(pattern => pattern.test(text.trim()));
  }

  private generateContextPath(line: string, type: string): string {
    const classMatch = line.match(/className=["']([^"']*)["']/);
    const idMatch = line.match(/id=["']([^"']*)["']/);

    let path = type;
    if (classMatch) path += `.${classMatch[1].split(' ')[0]}`;
    if (idMatch) path += `#${idMatch[1]}`;

    return path;
  }

  applyTextChanges(
    originalContent: string,
    changes: Array<{ original: string; modified: string; start: number; end: number }>
  ): string {
    let modifiedContent = originalContent;
    const sortedChanges = [...changes].sort((a, b) => b.start - a.start);

    for (const change of sortedChanges) {
      const before = modifiedContent.substring(0, change.start);
      const after = modifiedContent.substring(change.end);
      const originalSection = modifiedContent.substring(change.start, change.end);

      const updatedSection = originalSection.replace(change.original, change.modified);
      modifiedContent = before + updatedSection + after;
    }

    return modifiedContent;
  }
}

export const textExtractorService = new TextExtractorService();
