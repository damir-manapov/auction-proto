import { DEFAULT_RULES } from "../../../domain/rules";
import type { Rules } from "../../../types";
import type { RulesService } from "./contracts";

function cloneRules(rules: Rules): Rules {
  return {
    ...rules,
    channels: { ...rules.channels },
    paymentMethods: { ...rules.paymentMethods },
  };
}

export function createRulesService(initialRules: Rules = DEFAULT_RULES): RulesService {
  let current = cloneRules(initialRules);

  return {
    async get() {
      return cloneRules(current);
    },

    async update(rules) {
      current = cloneRules(rules);
      return cloneRules(current);
    },
  };
}
