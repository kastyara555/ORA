export const getAvailableDatesBySaloonAndProcedureUrl = (
  idSaloon: number,
  idProcedure: number
) => `/serviceInstance/${idSaloon}/${idProcedure}/availableDates`;
