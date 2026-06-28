import type { Rules } from "../../../types";

export type RulesService = {
  get: () => Promise<Rules>;
  update: (rules: Rules) => Promise<Rules>;
};
