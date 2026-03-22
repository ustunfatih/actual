import { Trans } from 'react-i18next';

import type { GoalTemplate } from 'loot-core/types/models/templates';
import type { TransObjectLiteral } from 'loot-core/types/util';

import { FinancialText } from '@desktop-client/components/FinancialText';
import { useFormat } from '@desktop-client/hooks/useFormat';

type GoalAutomationReadOnlyProps = {
  template: GoalTemplate;
};

export const GoalAutomationReadOnly = ({
  template,
}: GoalAutomationReadOnlyProps) => {
  const format = useFormat();

  return (
    <Trans>
      Balance goal:{' '}
      <FinancialText>
        {
          {
            amount: format(template.amount, 'financial'),
          } as TransObjectLiteral
        }
      </FinancialText>
    </Trans>
  );
};
