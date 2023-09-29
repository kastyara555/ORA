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

export const dayTimeByHours = (hours: number): string => {
  if (hours < 12) return "утра";

  if (hours < 17) return "дня";

  if (hours < 24) return "вечера";

  return "ночи";
};

export const prepareTime = (hours: number, minutes: number): string => {
  let result = "";

  result = result.concat(hours.toString().length > 1 ? hours.toString() : `0${hours}`);
  result = result.concat(":");
  result = result.concat(minutes.toString().length > 1 ? minutes.toString() : `0${minutes}`);

  return result;
}
