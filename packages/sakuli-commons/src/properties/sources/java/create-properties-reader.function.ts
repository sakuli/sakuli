import PropertiesReader from "properties-reader";

export function createPropertyReader(path: string | string[]) {
  const paths = Array.isArray(path) ? path : [path];
  const [head, ...files] = paths;
  let reader = PropertiesReader(head);
  for (let i = 0; i < files.length; i++) {
    reader = reader.append(files[i]);
  }
  return reader;
}
