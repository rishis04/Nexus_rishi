import { computeAccessibleName } from 'dom-accessibility-api';

export function computeElementAccessibleName(el: Element): string | null {
  try {
    const name = computeAccessibleName(el);
    return name ? name.trim() : null;
  } catch {
    // Fallback: aria-label, aria-labelledby, alt, placeholder, title
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    const title = el.getAttribute('title');
    if (title) return title.trim();

    const placeholder = el.getAttribute('placeholder');
    if (placeholder) return placeholder.trim();

    const alt = el.getAttribute('alt');
    if (alt) return alt.trim();

    return null;
  }
}
