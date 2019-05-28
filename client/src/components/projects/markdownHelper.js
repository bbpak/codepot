import sanitizeHtml from 'sanitize-html'

export const getHtml = (markdown) => {
	return {
		__html: `<!DOCTYPE html>
    <html lang="en">
    <body>
      <article class="markdown-body entry-content" itemprop="text">
        ${sanitizeHtml(markdown, {
			allowedTags: false,
			allowedAttributes: false,
			exclusiveFilter: function(frame) {
				return frame.tag === 'script'
			}
		})}
      </article>
    </body>
    </html>
  `
	}
}
