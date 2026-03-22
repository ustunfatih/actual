import { firstDayOfMonth } from 'loot-core/shared/months';
import type { Template } from 'loot-core/types/models/templates';

import type { Action } from './actions';
import type { DisplayTemplateType, ReducerState } from './constants';

export const DEFAULT_PRIORITY = 1;

export const getInitialState = (template: Template | null): ReducerState => {
  if (!template) {
    throw new Error('Template cannot be null');
  }
  const type = template.type;
  switch (type) {
    case 'simple':
      return {
        template: {
          type: 'periodic',
          amount: template.monthly ?? 0,
          period: {
            period: 'month',
            amount: 1,
          },
          starting: firstDayOfMonth(new Date()),
          priority: template.priority,
          directive: template.directive,
        },
        displayType: 'week',
      };
    case 'percentage':
      return {
        template,
        displayType: 'percentage',
      };
    case 'schedule':
      return {
        template,
        displayType: 'schedule',
      };
    case 'periodic':
      return {
        template,
        displayType: 'week',
      };
    case 'by':
    case 'spend':
      return {
        template,
        displayType: 'by-date',
      };
    case 'remainder':
      return {
        template,
        displayType: 'remainder',
      };
    case 'limit':
      return {
        template,
        displayType: 'limit',
      };
    case 'refill':
      return {
        template,
        displayType: 'refill',
      };
    case 'average':
    case 'copy':
      return {
        template,
        displayType: 'historical',
      };
    case 'goal':
      return {
        template,
        displayType: 'goal',
      };
    case 'error':
      throw new Error('An error occurred while parsing the template');
    default:
      throw new Error(`Unknown template type: ${type satisfies undefined}`);
  }
};

const changeType = (
  prevState: ReducerState,
  visualType: DisplayTemplateType,
): ReducerState => {
  switch (visualType) {
    case 'limit':
      if (prevState.template.type === 'limit') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'limit',
          amount: 500,
          period: 'monthly',
          hold: false,
          priority: null,
        },
      };
    case 'refill':
      if (prevState.template.type === 'refill') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'refill',
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'percentage':
      if (prevState.template.type === 'percentage') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'percentage',
          percent: 15,
          previous: false,
          category: 'total',
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'schedule':
      if (prevState.template.type === 'schedule') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'schedule',
          name: '',
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'week':
      if (prevState.template.type === 'periodic') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'periodic',
          amount: 5,
          period: {
            period: 'week',
            amount: 1,
          },
          starting: '',
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'historical':
      if (
        prevState.template.type === 'copy' ||
        prevState.template.type === 'average'
      ) {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'average',
          numMonths: 3,
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'by-date':
      if (
        prevState.template.type === 'by' ||
        prevState.template.type === 'spend'
      ) {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'by',
          amount: 500,
          month: `${new Date().getFullYear()}-12`,
          priority: DEFAULT_PRIORITY,
        },
      };
    case 'remainder':
      if (prevState.template.type === 'remainder') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'template',
          type: 'remainder',
          weight: 1,
          priority: null,
        },
      };
    case 'goal':
      if (prevState.template.type === 'goal') {
        return prevState;
      }
      return {
        displayType: visualType,
        template: {
          directive: 'goal',
          type: 'goal',
          amount: 1000,
        },
      };
    default:
      // Make sure we're not missing any cases
      throw new Error(`Unknown display type: ${visualType satisfies never}`);
  }
};

function mapTemplateTypesForUpdate(
  state: ReducerState,
  template: Partial<Template> & Pick<Template, 'type'>,
): ReducerState {
  switch (state.template.type) {
    case 'average':
      switch (template.type) {
        case 'copy':
          return {
            ...state,
            displayType: 'historical',
            template: {
              ...template,
              directive: 'template',
              type: 'copy',
              lookBack: state.template.numMonths,
              priority: state.template.priority,
            },
          };
        default:
          break;
      }
      break;
    case 'copy':
      switch (template.type) {
        case 'average':
          return {
            ...state,
            displayType: 'historical',
            template: {
              ...template,
              directive: 'template',
              type: 'average',
              numMonths: state.template.lookBack,
              priority: state.template.priority,
            },
          };
        default:
          break;
      }
      break;
    case 'by':
      if (template.type === 'spend') {
        return {
          ...state,
          displayType: 'by-date',
          template: {
            directive: 'template',
            type: 'spend',
            amount: state.template.amount,
            month: state.template.month,
            from: '',
            priority: state.template.priority,
          },
        };
      }
      break;
    case 'spend':
      if (template.type === 'by') {
        return {
          ...state,
          displayType: 'by-date',
          template: {
            directive: 'template',
            type: 'by',
            amount: state.template.amount,
            month: state.template.month,
            priority: state.template.priority,
          },
        };
      }
      break;
    default:
      break;
  }

  if (state.template.type === template.type) {
    const mergedTemplate = Object.assign({}, state.template, template);
    return {
      ...state,
      ...getInitialState(mergedTemplate),
    };
  }

  console.error(
    `Template type mismatch: ${state.template.type} !== ${template.type}`,
  );
  return state;
}

export const templateReducer = (
  state: ReducerState,
  action: Action,
): ReducerState => {
  const type = action.type;
  switch (type) {
    case 'set-type':
      return {
        ...state,
        ...changeType(state, action.payload),
      };
    case 'set-template':
      return {
        ...state,
        ...getInitialState(action.payload),
      };
    case 'update-template':
      return mapTemplateTypesForUpdate(state, action.payload);
    default:
      // Make sure we're not missing any cases
      throw new Error(`Unknown display type: ${type satisfies never}`);
  }
};
