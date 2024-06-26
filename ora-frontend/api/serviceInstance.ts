export const getAvailableDatesBySaloonAndProcedureUrl = (
  idSaloon: number,
  idProcedure: number
) => `/serviceInstance/${idSaloon}/${idProcedure}/availableDates`;

export const getAvailableMastersForProcedureBySaloonAndDateUrl = (
  idSaloon: number,
  idProcedure: number
) => `/serviceInstance/${idSaloon}/${idProcedure}/availableMasters`;

export const getAvailableRecordsForProcedureBySaloonDateAndMasterUrl = (
  idSaloon: number,
  idProcedure: number
) => `/serviceInstance/${idSaloon}/${idProcedure}/availableRecords`;

export const bookServiceInstanceUrl = () => '/serviceInstance/book';

export const loginBookServiceInstanceUrl = () => '/serviceInstance/login-book';
