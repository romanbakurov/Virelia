import { createOpenGraphImage } from '../opengraph-image';

export const runtime = 'edge';

export function GET() {
  return createOpenGraphImage('light');
}
