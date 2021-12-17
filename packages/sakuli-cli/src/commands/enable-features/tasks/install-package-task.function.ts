import execa from "execa";

export const installPackageTask = (npmPackageName: string) => {
  return async () => {
    await execa("npm", ["i", npmPackageName]);
  };
};
