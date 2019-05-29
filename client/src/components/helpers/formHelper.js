import sanitizeHtml from 'sanitize-html'
import { camelCase } from 'lodash'

// Some default html with classes for styling
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

// Replace _, -, camelCase with whitespace for legible name
export const namify = (text) => {
	return (
		camelCase(text)
			// insert a space before all caps
			.replace(/([A-Z])/g, ' $1')
			// uppercase the first character
			.replace(/^./, function(str) {
				return str.toUpperCase()
			})
	)
}
