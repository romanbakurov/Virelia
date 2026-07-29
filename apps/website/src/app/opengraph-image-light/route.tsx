import { createOpenGraphImage } from '../opengraph-image';

export async function GET() {
  return createOpenGraphImage('light');
}
