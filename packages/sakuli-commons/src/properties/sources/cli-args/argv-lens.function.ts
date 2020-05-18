export function argvLens(path: string[]) {
  return (obj: any): string | number | null => {
    if (path.length <= 0) {
      return obj;
    } else {
      const [key, ...restOfPath] = path;
      const nested = obj[key];
      const isLeaf = restOfPath.length === 0;
      if (Array.isArray(nested) && isLeaf) {
        return nested.find((o: any) => typeof o != "object");
      }
      if (Array.isArray(nested)) {
        const reducedObject = nested
          .filter((o) => typeof o === "object")
          .reduce((agg: object, o: object) => ({ ...agg, ...o }), {});
        return argvLens(restOfPath)(reducedObject);
      }
      if (typeof nested === "object") {
        return argvLens(restOfPath)(nested);
      } else {
        return nested;
      }
      return null;
    }
  };
}
