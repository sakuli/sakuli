export const createLens = (obj: any) => {
  return (path: string[]) => {
    return path.reduce((v: any, k) => {
      return v ? v[k] : null;
    }, obj);
  };
};
