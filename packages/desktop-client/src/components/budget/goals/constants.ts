import type {
  AverageTemplate,
  ByTemplate,
  CopyTemplate,
  GoalTemplate,
  LimitTemplate,
  PercentageTemplate,
  PeriodicTemplate,
  RefillTemplate,
  RemainderTemplate,
  ScheduleTemplate,
  SpendTemplate,
} from 'loot-core/types/models/templates';

export const displayTemplateTypes = [
  ['limit', 'Balance limit'] as const,
  ['refill', 'Refill'] as const,
  ['week', 'Fixed (weekly)'] as const,
  ['schedule', 'Existing schedule'] as const,
  ['percentage', 'Percent of category'] as const,
  ['historical', 'Copy past budgets'] as const,
  ['by-date', 'Save by date'] as const,
  ['remainder', 'Remainder'] as const,
  ['goal', 'Balance goal'] as const,
];

export type DisplayTemplateType = (typeof displayTemplateTypes)[number][0];

export type ReducerState =
  | {
      template: LimitTemplate;
      displayType: 'limit';
    }
  | {
      template: RefillTemplate;
      displayType: 'refill';
    }
  | {
      template: PeriodicTemplate;
      displayType: 'week';
    }
  | {
      template: ScheduleTemplate;
      displayType: 'schedule';
    }
  | {
      template: PercentageTemplate;
      displayType: 'percentage';
    }
  | {
      template: CopyTemplate | AverageTemplate;
      displayType: 'historical';
    }
  | {
      template: ByTemplate | SpendTemplate;
      displayType: 'by-date';
    }
  | {
      template: RemainderTemplate;
      displayType: 'remainder';
    }
  | {
      template: GoalTemplate;
      displayType: 'goal';
    };
