export async function executeScroll(
  direction: 'up' | 'down' | 'left' | 'right' = 'down',
  rawAmount = 300
): Promise<void> {
  const amount = Math.min(Math.max(10, rawAmount), 1200); // Cap scroll bounds

  let dx = 0;
  let dy = 0;

  switch (direction) {
    case 'up':
      dy = -amount;
      break;
    case 'down':
      dy = amount;
      break;
    case 'left':
      dx = -amount;
      break;
    case 'right':
      dx = amount;
      break;
  }

  if (typeof window !== 'undefined') {
    window.scrollBy({ left: dx, top: dy, behavior: 'instant' });
  }
}
