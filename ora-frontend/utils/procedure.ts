interface GetServicesBodyConfigModel {
  cityId: string | number | undefined;
  date: string | undefined;
}

export const configureGetServicesBody = ({
  cityId,
  date,
}: GetServicesBodyConfigModel) => ({
  cityId: +(cityId ?? 0) || null,
  date: date || null,
});
