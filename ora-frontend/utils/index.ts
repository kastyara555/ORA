export const configureUrl = (
  base: string,
  parameters: Array<{ name: string; value: string }>
) => {
  if (!parameters.length) return base;

  const parametersToString = parameters.reduce(
    (accumulator, item, index) =>
      accumulator + (index === 0 ? "?" : "&") + item.name + "=" + item.value,
    ""
  );

  return base.concat(parametersToString);
};
