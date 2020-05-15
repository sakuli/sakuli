import { mapAsync } from "./map.function";

export function filterAsync<T>(
  cb: (value: T, index: number, array: T[]) => Promise<boolean>
): (data: T[]) => Promise<T[]> {
  return async (array: T[]) => {
    const filterMap = await mapAsync(cb)(array);
    return array.filter((value, index) => filterMap[index]);
  };
}
