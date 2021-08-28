export const renderName: (name: string) => string = function (
  name: string,
): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
};