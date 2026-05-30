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
    data: {
      tiers: {
        Platinum: { label: "Platinum", mult: "+10%" },
        Gold: { label: "Gold", mult: "+5%" },
        Silver: { label: "Silver", mult: "+3%" },
        Standard: { label: "Standard", mult: "—" },
      },
      bidStates: {
        pending: "Ожидает",
        approved: "Принята",
        rejected: "Отклонена",
      },
      flightStatuses: {
        active: "Активен",
        sold: "Нет мест",
        upcoming: "Скоро",
      },
      haulLabels: {
        "ultra-short": "Ультракороткий (<1.5ч)",
        short: "Короткий (1.5–3ч)",
        medium: "Средний (3–5ч)",
        long: "Длинный (5–8ч)",
        ultra: "Ультрадальний (8ч+)",
      },
    },
  },
} as const;

export type Locale = keyof typeof I18N;

const CURRENT_LOCALE: Locale = "ru";

export const TXT = I18N[CURRENT_LOCALE];
