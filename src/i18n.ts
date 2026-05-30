export const I18N = {
  ru: {
    admin: {
      title: "Auction Admin",
      activeFlightsSuffix: "активных",
      bidsSuffix: "заявок",
      emptyFlightPrompt: "Выберите рейс из списка",
    },
    nav: {
      flights: "Рейсы",
      flight: "Детали рейса",
      rules: "Глобальные правила",
      email: "Email-шаблоны",
      passenger: "Интерфейс пассажира",
    },
    emailTemplates: {
      pte: "Приглашение (PTE)",
      chaser: "Напоминание",
      win: "Подтверждение",
    },
    seatMap: {
      taken: "Занято",
      bid: "Заявка",
      free: "Свободно",
    },
  },
} as const;

export type Locale = keyof typeof I18N;

const CURRENT_LOCALE: Locale = "ru";

export const TXT = I18N[CURRENT_LOCALE];
