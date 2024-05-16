export const SIDEBAR_PROGRESS_MAPPING = {
  monthForm: {
    step: 0,
    progress: 0,
    title: "Выбор месяца",
  },
  dateForm: {
    step: 1,
    progress: 25,
    title: "Выбор даты",
  },
  masterForm: {
    step: 2,
    progress: 50,
    title: "Выбор мастера",
  },
  timeForm: {
    step: 3,
    progress: 75,
    title: "Выбор времени",
  },
  checkoutForm: {
    step: 4,
    progress: 100,
    title: "Проверка",
  },
};

export const SIDEBAR_PROGRESS_LIST = Object.values(SIDEBAR_PROGRESS_MAPPING);
