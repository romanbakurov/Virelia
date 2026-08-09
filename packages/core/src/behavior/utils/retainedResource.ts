export type RetainedResourceDetach = () => void;

export type RetainedResourceRegistry<TTarget extends object> = {
  retain: (target: TTarget) => RetainedResourceDetach;
  release: (target: TTarget) => void;
  clear: () => void;
};

type RetainedResource = {
  count: number;
  detach: RetainedResourceDetach;
};

const noop = () => undefined;

export function createRetainedResourceRegistry<TTarget extends object>(
  attach: (target: TTarget) => RetainedResourceDetach | undefined
): RetainedResourceRegistry<TTarget> {
  const resources = new Map<TTarget, RetainedResource>();

  return {
    retain(target) {
      let resource = resources.get(target);

      if (!resource) {
        const detach = attach(target);

        if (!detach) return noop;

        resource = {
          count: 0,
          detach,
        };
        resources.set(target, resource);
      }

      resource.count += 1;

      return () => {
        this.release(target);
      };
    },

    release(target) {
      const resource = resources.get(target);

      if (!resource) return;

      resource.count = Math.max(0, resource.count - 1);

      if (resource.count > 0) return;

      resource.detach();
      resources.delete(target);
    },

    clear() {
      resources.forEach((resource) => {
        resource.detach();
      });
      resources.clear();
    },
  };
}
