import { Trans, useTranslation } from 'react-i18next';

import { SpaceBetween } from '@actual-app/components/space-between';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';

import type { GoalTemplate } from 'loot-core/types/models/templates';

import { updateTemplate } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';
import type { Action } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';

import { FormField, FormLabel } from '@desktop-client/components/forms';
import { AmountInput } from '@desktop-client/components/util/AmountInput';

type GoalAutomationProps = {
  template: GoalTemplate;
  dispatch: (action: Action) => void;
};

export const GoalAutomation = ({ template, dispatch }: GoalAutomationProps) => {
  const { t } = useTranslation();

  return (
    <SpaceBetween direction="vertical" gap={10} style={{ marginTop: 10 }}>
      <Text>
        <Trans>
          Sets a balance goal for this category. The goal indicator is based on
          the total category balance, not the monthly budgeted amount — ideal
          for long-term savings targets.
        </Trans>
      </Text>
      <SpaceBetween gap={50}>
        <FormField style={{ flex: 1 }}>
          <FormLabel title={t('Goal balance')} htmlFor="goal-amount-field" />
          <AmountInput
            id="goal-amount-field"
            value={template.amount ?? 0}
            zeroSign="+"
            onUpdate={(value: number) =>
              dispatch(updateTemplate({ type: 'goal', amount: value }))
            }
          />
        </FormField>
        <View style={{ flex: 1 }} />
      </SpaceBetween>
    </SpaceBetween>
  );
};
