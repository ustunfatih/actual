import { useTranslation } from 'react-i18next';

import { Input } from '@actual-app/components/input';
import { Select } from '@actual-app/components/select';
import { SpaceBetween } from '@actual-app/components/space-between';
import { View } from '@actual-app/components/view';

import type {
  ByTemplate,
  SpendTemplate,
} from 'loot-core/types/models/templates';

import { setTemplate, updateTemplate } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';
import type { Action } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';
import { DEFAULT_PRIORITY } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/reducer';

import { FormField, FormLabel } from '@desktop-client/components/forms';
import { AmountInput } from '@desktop-client/components/util/AmountInput';

type ByDateAutomationProps = {
  template: ByTemplate | SpendTemplate;
  dispatch: (action: Action) => void;
};

export const ByDateAutomation = ({
  template,
  dispatch,
}: ByDateAutomationProps) => {
  const { t } = useTranslation();

  const hasSpendFrom = template.type === 'spend';

  const repeatValue = template.annual
    ? 'annual'
    : template.repeat
      ? `${template.repeat}`
      : 'none';

  const handleSpendFromToggle = (checked: boolean) => {
    if (checked) {
      dispatch(
        setTemplate({
          directive: 'template',
          type: 'spend',
          amount: template.amount,
          month: template.month,
          from: template.month,
          annual: template.annual,
          repeat: template.repeat,
          priority: template.priority ?? DEFAULT_PRIORITY,
        }),
      );
    } else {
      dispatch(
        updateTemplate({
          type: 'by',
        }),
      );
    }
  };

  return (
    <>
      <SpaceBetween gap={50} style={{ marginTop: 10 }}>
        <FormField style={{ flex: 1 }}>
          <FormLabel title={t('Target amount')} htmlFor="by-amount-field" />
          <AmountInput
            id="by-amount-field"
            value={template.amount ?? 0}
            zeroSign="+"
            onUpdate={(value: number) =>
              dispatch(updateTemplate({ type: template.type, amount: value }))
            }
          />
        </FormField>
        <FormField style={{ flex: 1 }}>
          <FormLabel title={t('Target month')} htmlFor="by-month-field" />
          <Input
            id="by-month-field"
            type="month"
            value={template.month ?? ''}
            onChange={e =>
              dispatch(
                updateTemplate({ type: template.type, month: e.target.value }),
              )
            }
          />
        </FormField>
      </SpaceBetween>

      <SpaceBetween gap={50} style={{ marginTop: 10 }}>
        <FormField style={{ flex: 1 }}>
          <FormLabel title={t('Repeat')} htmlFor="by-repeat-field" />
          <Select
            id="by-repeat-field"
            options={[
              ['none', t('No repeat')],
              ['annual', t('Every year')],
              ['6', t('Every 6 months')],
              ['3', t('Every 3 months')],
            ]}
            value={repeatValue}
            onChange={value => {
              if (value === 'none') {
                dispatch(
                  updateTemplate({
                    type: template.type,
                    annual: undefined,
                    repeat: undefined,
                  }),
                );
              } else if (value === 'annual') {
                dispatch(
                  updateTemplate({
                    type: template.type,
                    annual: true,
                    repeat: undefined,
                  }),
                );
              } else {
                dispatch(
                  updateTemplate({
                    type: template.type,
                    annual: undefined,
                    repeat: Number(value),
                  }),
                );
              }
            }}
          />
        </FormField>
        <View style={{ flex: 1 }} />
      </SpaceBetween>

      <SpaceBetween gap={10} style={{ marginTop: 10, alignItems: 'center' }}>
        <input
          type="checkbox"
          id="by-spend-from-toggle"
          checked={hasSpendFrom}
          onChange={e => handleSpendFromToggle(e.target.checked)}
        />
        <FormLabel
          title={t('Allow spending from a date')}
          htmlFor="by-spend-from-toggle"
          style={{ marginBottom: 0 }}
        />
      </SpaceBetween>

      {hasSpendFrom && (
        <SpaceBetween gap={50} style={{ marginTop: 10 }}>
          <FormField style={{ flex: 1 }}>
            <FormLabel
              title={t('Spend from month')}
              htmlFor="by-spend-from-field"
            />
            <Input
              id="by-spend-from-field"
              type="month"
              value={(template as SpendTemplate).from ?? ''}
              onChange={e =>
                dispatch(
                  updateTemplate({ type: 'spend', from: e.target.value }),
                )
              }
            />
          </FormField>
          <View style={{ flex: 1 }} />
        </SpaceBetween>
      )}
    </>
  );
};
