import type { AnimatedIconData } from '@vellira-ui/icons/lottie';

type Point = readonly [number, number];

type LottiePath = {
  c?: boolean;
  i?: readonly Point[];
  o?: readonly Point[];
  v?: readonly Point[];
};

type LottieShape = {
  ty?: string;
  ks?: {
    k?: LottiePath;
  };
};

type LottieKeyframe<T> = {
  t?: number;
  s?: T;
};

type LottieAnimatedValue<T> = {
  a?: number;
  k?: T | ReadonlyArray<LottieKeyframe<T>>;
};

type LottieLayer = {
  ks?: {
    r?: LottieAnimatedValue<number>;
    s?: LottieAnimatedValue<readonly number[]>;
  };
  shapes?: readonly LottieShape[];
};

type LottieRoot = {
  fr?: number;
  ip?: number;
  op?: number;
  layers?: readonly LottieLayer[];
};

type AnimatedIconPreviewProps = {
  data: AnimatedIconData;
  size?: number;
};

function isPoint(value: unknown): value is Point {
  return (
    Array.isArray(value) &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
}

function formatNumber(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function formatPoint(point: Point): string {
  return `${formatNumber(point[0])} ${formatNumber(point[1])}`;
}

function addPoints(first: Point, second: Point): Point {
  return [first[0] + second[0], first[1] + second[1]];
}

function pathToD(path: LottiePath): string | null {
  const vertices = path.v;
  const inTangents = path.i;
  const outTangents = path.o;

  if (!vertices?.length || !inTangents?.length || !outTangents?.length) {
    return null;
  }

  if (!vertices.every(isPoint) || !inTangents.every(isPoint)) return null;
  if (!outTangents.every(isPoint)) return null;

  const segments = [`M ${formatPoint(vertices[0])}`];
  const segmentCount = path.c ? vertices.length : vertices.length - 1;

  for (let index = 0; index < segmentCount; index += 1) {
    const nextIndex = (index + 1) % vertices.length;
    const controlStart = addPoints(vertices[index], outTangents[index]);
    const controlEnd = addPoints(vertices[nextIndex], inTangents[nextIndex]);

    segments.push(
      `C ${formatPoint(controlStart)} ${formatPoint(controlEnd)} ${formatPoint(
        vertices[nextIndex]
      )}`
    );
  }

  if (path.c) segments.push('Z');

  return segments.join(' ');
}

function getVectorLayer(data: AnimatedIconData): LottieLayer | undefined {
  return (data as unknown as LottieRoot).layers?.find((layer) =>
    layer.shapes?.some((shape) => shape.ty === 'sh')
  );
}

function getShapePaths(layer: LottieLayer | undefined): string[] {
  return (
    layer?.shapes
      ?.map((shape) => (shape.ty === 'sh' ? pathToD(shape.ks?.k ?? {}) : null))
      .filter((path): path is string => Boolean(path)) ?? []
  );
}

function getAnimatedValues<T>(
  value: LottieAnimatedValue<T> | undefined
): T[] | undefined {
  if (!value || value.a !== 1 || !Array.isArray(value.k)) return undefined;

  const values = value.k
    .map((keyframe) => keyframe.s)
    .filter((item): item is T => item !== undefined);

  return values.length > 1 ? values : undefined;
}

function getRotationValues(layer: LottieLayer | undefined): string | undefined {
  const values = getAnimatedValues(layer?.ks?.r);

  return values?.map((value) => formatNumber(value)).join(';');
}

function getScaleValues(layer: LottieLayer | undefined): string | undefined {
  const values = getAnimatedValues(layer?.ks?.s);

  return values
    ?.map((value) => formatNumber((value[0] ?? 100) / 100))
    .join(';');
}

export function AnimatedIconPreview({
  data,
  size = 16,
}: AnimatedIconPreviewProps) {
  const root = data as unknown as LottieRoot;
  const layer = getVectorLayer(data);
  const paths = getShapePaths(layer);
  const duration = `${((root.op ?? 15) - (root.ip ?? 0)) / (root.fr ?? 30)}s`;
  const rotationValues = getRotationValues(layer);
  const scaleValues = getScaleValues(layer);

  return (
    <svg
      aria-hidden='true'
      focusable='false'
      viewBox='0 0 24 24'
      width={size}
      height={size}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {rotationValues ? (
          <animateTransform
            attributeName='transform'
            type='rotate'
            values={rotationValues}
            dur={duration}
            repeatCount='indefinite'
            additive='sum'
          />
        ) : null}
        {!rotationValues && scaleValues ? (
          <animateTransform
            attributeName='transform'
            type='scale'
            values={scaleValues}
            dur={duration}
            repeatCount='indefinite'
            additive='sum'
          />
        ) : null}
        {paths.map((path, index) => (
          <path key={`${index}-${path}`} d={path} fill='currentColor' />
        ))}
      </g>
    </svg>
  );
}
