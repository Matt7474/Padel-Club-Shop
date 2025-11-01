import sanitizeHtml from "sanitize-html";

export function sanitizeInput(value: string): string {
	return sanitizeHtml(value, {
		allowedTags: [],
		allowedAttributes: {},
	}).trim();
}
