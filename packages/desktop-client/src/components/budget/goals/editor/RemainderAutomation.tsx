import { Trans, useTranslation } from 'react-i18next';

import { SpaceBetween } from '@actual-app/components/space-between';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';

import type { RemainderTemplate } from 'loot-core/types/models/templates';

import { updateTemplate } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';
import type { Action } from '.claude/worktrees/competent-banach/packages/desktop-client/src/components/budget/goals/actions';

import { FormField, FormLabel } from '@desktop-client/components/forms';
import { GenericInput } from '@desktop-client/components/util/GenericInput';

type RemainderAutomationProps = {
  template: RemainderTemplate;
  dispatch: (action: Action) => void;
};

export const RemainderAutomation = ({
  template,
  dispatch,
}: RemainderAutomationProps) => {
  const { t } = useTranslation();

  return (
    <SpaceBetween direction="vertical" gap={10} style={{ marginTop: 10 }}>
      <Text>
        <Trans>
          Distributes all remaining &quot;To Budget&quot; funds into this
          category. Runs last, after all other automations. Use the weight to
          share remainder proportionally across multiple remainder automations.
        </Trans>
      </Text>
      <SpaceBetween gap={50}>
        <FormField style={{ flex: 1 }}>
          <FormLabel title={t('Weight')} htmlFor="remainder-weight-field" />
          <GenericInput
            type="number"
            value={template.weight ?? 1}
            onChange={(value: number) =>
              dispatch(updateTemplate({ type: 'remainder', weight: value }))
            }
          />
        </FormField>
        <View style={{ flex: 1 }} />
      </SpaceBetween>
    </SpaceBetween>
  );
};
