import fs from 'node:fs';
import path from 'node:path';

type Point = [number, number];
type Keyframe<T> = {
  t: number;
  s: T;
  e?: T;
};
type Transform = {
  anchor?: Point;
  position?: Keyframe<[number, number, number]>[] | [number, number, number];
  rotation?: Keyframe<[number]>[] | [number];
  scale?: Keyframe<[number, number, number]>[] | [number, number, number];
  opacity?: Keyframe<[number]>[] | [number];
};
type ShapeLayer = {
  name: string;
  shapes: Shape[];
  transform?: Transform;
  index?: number;
};
type Shape =
  | {
      type: 'path';
      name: string;
      points: Point[];
      closed?: boolean;
    }
  | {
      type: 'rect';
      name: string;
      position: Point;
      size: Point;
      radius?: number;
    }
  | {
      type: 'ellipse';
      name: string;
      position: Point;
      size: Point;
    };

const ROOT = process.cwd();
const LOTTIE_ROOT = path.join(ROOT, 'lottie');
const OUT_FRAME = 30;
const EASE_OUT = { x: [0.22], y: [1] };
const EASE_IN = { x: [0.55], y: [0] };
const COLOR = [0, 0, 0, 1];

function k<T>(frames: Keyframe<T>[]) {
  if (frames.length === 1) {
    return {
      a: 0,
      k: frames[0].s,
    };
  }

  return {
    a: 1,
    k: frames.map((frame) => ({
      t: frame.t,
      s: frame.s,
      ...(frame.e ? { e: frame.e, o: EASE_OUT, i: EASE_IN } : {}),
    })),
  };
}

function staticK<T>(value: T) {
  return {
    a: 0,
    k: value,
  };
}

function transform(value: Transform = {}) {
  return {
    o: Array.isArray(value.opacity)
      ? staticK(value.opacity)
      : k(value.opacity ?? [{ t: 0, s: [100] }]),
    r: Array.isArray(value.rotation)
      ? staticK(value.rotation)
      : k(value.rotation ?? [{ t: 0, s: [0] }]),
    p: Array.isArray(value.position)
      ? staticK(value.position)
      : k(value.position ?? [{ t: 0, s: [12, 12, 0] }]),
    a: staticK([value.anchor?.[0] ?? 12, value.anchor?.[1] ?? 12, 0]),
    s: Array.isArray(value.scale)
      ? staticK(value.scale)
      : k(value.scale ?? [{ t: 0, s: [100, 100, 100] }]),
  };
}

function pathShape(shape: Extract<Shape, { type: 'path' }>) {
  const points = shape.points;
  return {
    ty: 'sh',
    nm: shape.name,
    hd: false,
    ks: {
      a: 0,
      k: {
        i: points.map(() => [0, 0]),
        o: points.map(() => [0, 0]),
        v: points,
        c: shape.closed ?? false,
      },
    },
  };
}

function rectShape(shape: Extract<Shape, { type: 'rect' }>) {
  return {
    ty: 'rc',
    nm: shape.name,
    p: staticK(shape.position),
    s: staticK(shape.size),
    r: staticK(shape.radius ?? 0),
    hd: false,
  };
}

function ellipseShape(shape: Extract<Shape, { type: 'ellipse' }>) {
  return {
    ty: 'el',
    nm: shape.name,
    p: staticK(shape.position),
    s: staticK(shape.size),
    d: 1,
    hd: false,
  };
}

function shapeEntry(shape: Shape) {
  if (shape.type === 'path') return pathShape(shape);
  if (shape.type === 'rect') return rectShape(shape);
  return ellipseShape(shape);
}

function stroke(width = 1.8) {
  return {
    ty: 'st',
    nm: 'Stroke',
    c: staticK(COLOR),
    o: staticK(100),
    w: staticK(width),
    lc: 2,
    lj: 2,
    ml: 4,
    hd: false,
  };
}

function fill() {
  return {
    ty: 'fl',
    nm: 'Color',
    c: staticK(COLOR),
    o: staticK(100),
    r: 2,
    hd: false,
  };
}

function layer(layer: ShapeLayer, fallbackIndex: number) {
  const usesFill = layer.shapes.some(
    (shape) => shape.type === 'path' && shape.closed
  );

  return {
    ddd: 0,
    ind: layer.index ?? fallbackIndex,
    ty: 4,
    nm: layer.name,
    sr: 1,
    ks: transform(layer.transform),
    ao: 0,
    shapes: [...layer.shapes.map(shapeEntry), usesFill ? fill() : stroke()],
    ip: 0,
    op: OUT_FRAME,
    st: 0,
    bm: 0,
  };
}

function icon(name: string, category: string, layers: ShapeLayer[]) {
  return {
    v: '5.12.2',
    fr: 30,
    ip: 0,
    op: OUT_FRAME,
    w: 24,
    h: 24,
    nm: `Vellira ${name} Semantic`,
    ddd: 0,
    meta: {
      g: 'Vellira Icons',
      category,
      interaction: 'semantic-hover-or-press',
      loop: false,
    },
    assets: [],
    layers: layers.map((item, index) => layer(item, layers.length - index)),
    markers: [
      { tm: 0, cm: 'Start', dr: 0 },
      { tm: 28, cm: 'Rest', dr: 0 },
    ],
  };
}

function write(file: string, data: unknown) {
  fs.writeFileSync(
    path.join(LOTTIE_ROOT, file),
    `${JSON.stringify(data, null, 2)}\n`
  );
}

function motion<T>(values: [number, T][]): Keyframe<T>[] {
  return values.map(([t, value], index) => ({
    t,
    s: value,
    e: values[index + 1]?.[1],
  }));
}

const trashBody: ShapeLayer = {
  name: 'Bin body',
  shapes: [
    {
      type: 'path',
      name: 'Body',
      points: [
        [6, 8],
        [7, 20],
        [17, 20],
        [18, 8],
      ],
    },
    {
      type: 'path',
      name: 'Lines left',
      points: [
        [10, 11],
        [10, 17],
      ],
    },
    {
      type: 'path',
      name: 'Lines right',
      points: [
        [14, 11],
        [14, 17],
      ],
    },
  ],
};

write(
  'Actions/Trash.json',
  icon('Trash', 'Actions', [
    {
      name: 'Falling paper',
      shapes: [
        {
          type: 'rect',
          name: 'Paper',
          position: [12, 9],
          size: [3, 3],
          radius: 0.4,
        },
      ],
      transform: {
        anchor: [12, 9],
        opacity: motion([
          [0, [0]],
          [4, [100]],
          [18, [100]],
          [23, [0]],
          [29, [0]],
        ]),
        position: motion([
          [0, [12, 4, 0]],
          [5, [12, 7, 0]],
          [15, [12, 14, 0]],
          [23, [12, 19, 0]],
          [29, [12, 19, 0]],
        ]),
        rotation: motion([
          [0, [-14]],
          [10, [12]],
          [20, [-6]],
          [29, [0]],
        ]),
      },
    },
    {
      name: 'Lid',
      shapes: [
        {
          type: 'path',
          name: 'Lid line',
          points: [
            [5, 7],
            [19, 7],
          ],
        },
        {
          type: 'path',
          name: 'Handle',
          points: [
            [9.5, 5],
            [14.5, 5],
          ],
        },
      ],
      transform: {
        anchor: [6, 7],
        position: [12, 12, 0],
        rotation: motion([
          [0, [0]],
          [6, [-28]],
          [18, [-28]],
          [26, [0]],
          [29, [0]],
        ]),
      },
    },
    trashBody,
  ])
);

write(
  'System/Settings.json',
  icon('Settings', 'System', [
    {
      name: 'Gear',
      shapes: [
        {
          type: 'ellipse',
          name: 'Outer gear',
          position: [12, 12],
          size: [14, 14],
        },
        {
          type: 'ellipse',
          name: 'Inner hole',
          position: [12, 12],
          size: [5, 5],
        },
        {
          type: 'path',
          name: 'Top tooth',
          points: [
            [12, 2.5],
            [12, 5],
          ],
        },
        {
          type: 'path',
          name: 'Bottom tooth',
          points: [
            [12, 19],
            [12, 21.5],
          ],
        },
        {
          type: 'path',
          name: 'Left tooth',
          points: [
            [2.5, 12],
            [5, 12],
          ],
        },
        {
          type: 'path',
          name: 'Right tooth',
          points: [
            [19, 12],
            [21.5, 12],
          ],
        },
        {
          type: 'path',
          name: 'Diagonal one',
          points: [
            [5.4, 5.4],
            [7.2, 7.2],
          ],
        },
        {
          type: 'path',
          name: 'Diagonal two',
          points: [
            [16.8, 16.8],
            [18.6, 18.6],
          ],
        },
        {
          type: 'path',
          name: 'Diagonal three',
          points: [
            [18.6, 5.4],
            [16.8, 7.2],
          ],
        },
        {
          type: 'path',
          name: 'Diagonal four',
          points: [
            [7.2, 16.8],
            [5.4, 18.6],
          ],
        },
      ],
      transform: {
        rotation: motion([
          [0, [0]],
          [20, [340]],
          [29, [360]],
        ]),
        scale: motion([
          [0, [100, 100, 100]],
          [8, [106, 106, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'System/Folder.json',
  icon('Folder', 'System', [
    {
      name: 'Back',
      shapes: [
        {
          type: 'path',
          name: 'Back outline',
          points: [
            [3, 18],
            [3, 7],
            [5, 5],
            [10, 5],
            [12.5, 7.4],
            [19, 7.4],
            [21, 9.4],
            [21, 18],
          ],
        },
      ],
    },
    {
      name: 'Front flap',
      shapes: [
        {
          type: 'path',
          name: 'Front',
          points: [
            [3, 10.5],
            [21, 10.5],
            [21, 18.5],
            [18.5, 20.5],
            [5.5, 20.5],
            [3, 18.5],
          ],
          closed: false,
        },
      ],
      transform: {
        anchor: [12, 20],
        position: motion([
          [0, [12, 12, 0]],
          [9, [12, 13.5, 0]],
          [20, [12, 13.5, 0]],
          [29, [12, 12, 0]],
        ]),
        scale: motion([
          [0, [100, 100, 100]],
          [9, [106, 58, 100]],
          [20, [106, 58, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'System/FolderOpen.json',
  icon('FolderOpen', 'System', [
    {
      name: 'Back',
      shapes: [
        {
          type: 'path',
          name: 'Back outline',
          points: [
            [3, 17],
            [3, 7],
            [5, 5],
            [10, 5],
            [12.5, 7.4],
            [19, 7.4],
            [21, 9.4],
            [21, 17],
          ],
        },
      ],
    },
    {
      name: 'Open front',
      shapes: [
        {
          type: 'path',
          name: 'Open front',
          points: [
            [4, 11],
            [20, 11],
            [18, 20],
            [6, 20],
          ],
          closed: false,
        },
      ],
      transform: {
        anchor: [12, 20],
        scale: motion([
          [0, [102, 70, 100]],
          [9, [98, 100, 100]],
          [18, [102, 70, 100]],
          [29, [102, 70, 100]],
        ]),
        position: motion([
          [0, [12, 13.2, 0]],
          [9, [12, 12, 0]],
          [18, [12, 13.2, 0]],
          [29, [12, 13.2, 0]],
        ]),
      },
    },
  ])
);

write(
  'Actions/Edit.json',
  icon('Edit', 'Actions', [
    {
      name: 'Written line',
      shapes: [
        {
          type: 'path',
          name: 'Line',
          points: [
            [5, 19.5],
            [19, 19.5],
          ],
        },
      ],
      transform: {
        scale: motion([
          [0, [0, 100, 100]],
          [20, [100, 100, 100]],
          [29, [100, 100, 100]],
        ]),
        anchor: [5, 19.5],
        position: [5, 19.5, 0],
      },
    },
    {
      name: 'Pencil',
      shapes: [
        {
          type: 'path',
          name: 'Pencil body',
          points: [
            [5.5, 16],
            [15.5, 6],
            [18, 8.5],
            [8, 18.5],
          ],
          closed: true,
        },
        {
          type: 'path',
          name: 'Tip',
          points: [
            [5.5, 16],
            [4.5, 20],
            [8, 18.5],
          ],
          closed: true,
        },
      ],
      transform: {
        anchor: [6, 18],
        position: motion([
          [0, [9, 12, 0]],
          [8, [11.5, 11.3, 0]],
          [17, [15, 10.8, 0]],
          [29, [12, 12, 0]],
        ]),
        rotation: motion([
          [0, [-10]],
          [8, [7]],
          [17, [-5]],
          [29, [0]],
        ]),
      },
    },
  ])
);

write(
  'Communication/Bell.json',
  icon('Bell', 'Communication', [
    {
      name: 'Clapper',
      shapes: [
        {
          type: 'ellipse',
          name: 'Clapper',
          position: [12, 18.8],
          size: [2.4, 2.4],
        },
      ],
      transform: {
        anchor: [12, 8],
        rotation: motion([
          [0, [0]],
          [5, [-18]],
          [11, [17]],
          [17, [-10]],
          [23, [5]],
          [29, [0]],
        ]),
      },
    },
    {
      name: 'Bell shell',
      shapes: [
        {
          type: 'path',
          name: 'Shell',
          points: [
            [6.5, 17],
            [17.5, 17],
            [16, 10],
            [15, 7],
            [12, 5.5],
            [9, 7],
            [8, 10],
            [6.5, 17],
          ],
          closed: false,
        },
        {
          type: 'path',
          name: 'Bottom',
          points: [
            [9.5, 20],
            [14.5, 20],
          ],
        },
      ],
      transform: {
        anchor: [12, 5.5],
        rotation: motion([
          [0, [0]],
          [5, [-13]],
          [11, [12]],
          [17, [-7]],
          [23, [4]],
          [29, [0]],
        ]),
      },
    },
  ])
);

write(
  'Actions/Download.json',
  icon('Download', 'Actions', [
    {
      name: 'Base',
      shapes: [
        {
          type: 'ellipse',
          name: 'Round base',
          position: [12, 17.4],
          size: [13, 5.2],
        },
      ],
      transform: {
        scale: motion([
          [0, [100, 100, 100]],
          [17, [112, 88, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
    {
      name: 'Arrow',
      shapes: [
        {
          type: 'path',
          name: 'Stem',
          points: [
            [12, 4],
            [12, 14.5],
          ],
        },
        {
          type: 'path',
          name: 'Head',
          points: [
            [8, 11],
            [12, 15],
            [16, 11],
          ],
        },
      ],
      transform: {
        position: motion([
          [0, [12, 10, 0]],
          [16, [12, 14.2, 0]],
          [23, [12, 11.2, 0]],
          [29, [12, 12, 0]],
        ]),
        scale: motion([
          [0, [100, 100, 100]],
          [16, [94, 108, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'Actions/Upload.json',
  icon('Upload', 'Actions', [
    {
      name: 'Base',
      shapes: [
        {
          type: 'path',
          name: 'Receiver',
          points: [
            [5, 17],
            [5, 20],
            [19, 20],
            [19, 17],
          ],
        },
      ],
    },
    {
      name: 'Arrow',
      shapes: [
        {
          type: 'path',
          name: 'Stem',
          points: [
            [12, 17],
            [12, 6.5],
          ],
        },
        {
          type: 'path',
          name: 'Head',
          points: [
            [8, 10],
            [12, 6],
            [16, 10],
          ],
        },
      ],
      transform: {
        position: motion([
          [0, [12, 13, 0]],
          [14, [12, 8.8, 0]],
          [22, [12, 11.2, 0]],
          [29, [12, 12, 0]],
        ]),
        scale: motion([
          [0, [100, 100, 100]],
          [14, [94, 108, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'Communication/Mail.json',
  icon('Mail', 'Communication', [
    {
      name: 'Envelope body',
      shapes: [
        {
          type: 'rect',
          name: 'Body',
          position: [12, 13],
          size: [17, 11],
          radius: 1.8,
        },
        {
          type: 'path',
          name: 'Fold left',
          points: [
            [4, 10],
            [12, 15],
            [20, 10],
          ],
        },
      ],
    },
    {
      name: 'Envelope flap',
      shapes: [
        {
          type: 'path',
          name: 'Flap',
          points: [
            [4.5, 10],
            [12, 15],
            [19.5, 10],
          ],
        },
      ],
      transform: {
        anchor: [12, 10],
        scale: motion([
          [0, [100, 100, 100]],
          [11, [100, -70, 100]],
          [21, [100, -70, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'System/Lock.json',
  icon('Lock', 'System', [
    {
      name: 'Shackle',
      shapes: [
        {
          type: 'path',
          name: 'Shackle',
          points: [
            [8, 10],
            [8, 7],
            [8.8, 4.8],
            [12, 3.5],
            [15.2, 4.8],
            [16, 7],
            [16, 10],
          ],
        },
      ],
      transform: {
        anchor: [12, 10],
        position: motion([
          [0, [12, 10, 0]],
          [8, [12, 7.8, 0]],
          [18, [12, 10, 0]],
          [29, [12, 10, 0]],
        ]),
      },
    },
    {
      name: 'Body',
      shapes: [
        {
          type: 'rect',
          name: 'Body',
          position: [12, 15.5],
          size: [13, 9],
          radius: 2,
        },
      ],
    },
  ])
);

write(
  'System/LockOpen.json',
  icon('LockOpen', 'System', [
    {
      name: 'Open shackle',
      shapes: [
        {
          type: 'path',
          name: 'Shackle',
          points: [
            [8, 10],
            [8, 7],
            [8.8, 4.8],
            [12, 3.5],
            [15.2, 4.8],
            [16, 7],
          ],
        },
      ],
      transform: {
        anchor: [8, 10],
        rotation: motion([
          [0, [0]],
          [12, [-32]],
          [22, [-32]],
          [29, [0]],
        ]),
        position: motion([
          [0, [12, 10, 0]],
          [12, [11.4, 9.6, 0]],
          [22, [11.4, 9.6, 0]],
          [29, [12, 10, 0]],
        ]),
      },
    },
    {
      name: 'Body',
      shapes: [
        {
          type: 'rect',
          name: 'Body',
          position: [12, 15.5],
          size: [13, 9],
          radius: 2,
        },
      ],
    },
  ])
);

write(
  'Status/Eye.json',
  icon('Eye', 'Status', [
    {
      name: 'Iris',
      shapes: [
        { type: 'ellipse', name: 'Iris', position: [12, 12], size: [4, 4] },
      ],
      transform: {
        scale: motion([
          [0, [100, 100, 100]],
          [9, [100, 12, 100]],
          [16, [100, 12, 100]],
          [24, [100, 100, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
    {
      name: 'Eye shell',
      shapes: [
        {
          type: 'path',
          name: 'Eye',
          points: [
            [3, 12],
            [6, 8],
            [12, 6.5],
            [18, 8],
            [21, 12],
            [18, 16],
            [12, 17.5],
            [6, 16],
            [3, 12],
          ],
          closed: false,
        },
      ],
      transform: {
        scale: motion([
          [0, [100, 100, 100]],
          [9, [100, 22, 100]],
          [16, [100, 22, 100]],
          [24, [100, 100, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'Status/Heart.json',
  icon('Heart', 'Status', [
    {
      name: 'Heart pulse',
      shapes: [
        {
          type: 'path',
          name: 'Heart',
          points: [
            [12, 20],
            [4.5, 12.8],
            [3.8, 8.6],
            [6.8, 5.2],
            [10, 6.2],
            [12, 8.4],
            [14, 6.2],
            [17.2, 5.2],
            [20.2, 8.6],
            [19.5, 12.8],
            [12, 20],
          ],
          closed: true,
        },
      ],
      transform: {
        scale: motion([
          [0, [100, 100, 100]],
          [6, [118, 118, 100]],
          [12, [94, 94, 100]],
          [19, [110, 110, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'Actions/Search.json',
  icon('Search', 'Actions', [
    {
      name: 'Lens',
      shapes: [
        {
          type: 'ellipse',
          name: 'Circle',
          position: [10.5, 10.5],
          size: [10.5, 10.5],
        },
        {
          type: 'path',
          name: 'Handle',
          points: [
            [14.5, 14.5],
            [20, 20],
          ],
        },
      ],
      transform: {
        anchor: [10.5, 10.5],
        position: motion([
          [0, [12, 12, 0]],
          [7, [10.8, 11.4, 0]],
          [15, [13.1, 10.9, 0]],
          [23, [12.4, 12.7, 0]],
          [29, [12, 12, 0]],
        ]),
        rotation: motion([
          [0, [0]],
          [7, [-12]],
          [15, [12]],
          [29, [0]],
        ]),
      },
    },
  ])
);

write(
  'Actions/Refresh.json',
  icon('Refresh', 'Actions', [
    {
      name: 'Refresh spin',
      shapes: [
        {
          type: 'path',
          name: 'Top arc',
          points: [
            [18, 8],
            [15.5, 5.5],
            [11.5, 5.2],
            [7.5, 7.2],
            [5.5, 10.5],
          ],
        },
        {
          type: 'path',
          name: 'Bottom arc',
          points: [
            [6, 16],
            [8.5, 18.5],
            [12.5, 18.8],
            [16.5, 16.8],
            [18.5, 13.5],
          ],
        },
        {
          type: 'path',
          name: 'Head one',
          points: [
            [18, 4.5],
            [18, 8],
            [14.5, 8],
          ],
        },
        {
          type: 'path',
          name: 'Head two',
          points: [
            [6, 19.5],
            [6, 16],
            [9.5, 16],
          ],
        },
      ],
      transform: {
        rotation: motion([
          [0, [0]],
          [21, [350]],
          [29, [360]],
        ]),
      },
    },
  ])
);

write(
  'Media/Play.json',
  icon('Play', 'Media', [
    {
      name: 'Play impulse',
      shapes: [
        {
          type: 'path',
          name: 'Triangle',
          points: [
            [8, 5.5],
            [19, 12],
            [8, 18.5],
          ],
          closed: true,
        },
      ],
      transform: {
        scale: motion([
          [0, [100, 100, 100]],
          [7, [118, 118, 100]],
          [15, [94, 94, 100]],
          [29, [100, 100, 100]],
        ]),
      },
    },
  ])
);

write(
  'Media/Pause.json',
  icon('Pause', 'Media', [
    {
      name: 'Left bar',
      shapes: [
        {
          type: 'rect',
          name: 'Left',
          position: [9, 12],
          size: [3, 13],
          radius: 1,
        },
      ],
      transform: {
        position: motion([
          [0, [12, 12, 0]],
          [8, [10.8, 12, 0]],
          [18, [12, 12, 0]],
          [29, [12, 12, 0]],
        ]),
      },
    },
    {
      name: 'Right bar',
      shapes: [
        {
          type: 'rect',
          name: 'Right',
          position: [15, 12],
          size: [3, 13],
          radius: 1,
        },
      ],
      transform: {
        position: motion([
          [0, [12, 12, 0]],
          [8, [13.2, 12, 0]],
          [18, [12, 12, 0]],
          [29, [12, 12, 0]],
        ]),
      },
    },
  ])
);
