import { Trans } from 'react-i18next';

import type {
  ByTemplate,
  SpendTemplate,
} from 'loot-core/types/models/templates';
import type { TransObjectLiteral } from 'loot-core/types/util';

import { FinancialText } from '@desktop-client/components/FinancialText';
import { useFormat } from '@desktop-client/hooks/useFormat';

type ByDateAutomationReadOnlyProps = {
  template: ByTemplate | SpendTemplate;
};

export const ByDateAutomationReadOnly = ({
  template,
}: ByDateAutomationReadOnlyProps) => {
  const format = useFormat();

  if (template.type === 'spend') {
    return (
      <Trans>
        Save{' '}
        <FinancialText>
          {
            {
              amount: format(template.amount, 'financial'),
            } as TransObjectLiteral
          }
        </FinancialText>{' '}
        by {{ month: template.month }}, spending allowed from{' '}
        {{ from: template.from }}
      </Trans>
    );
  }

  return (
    <Trans>
      Save{' '}
      <FinancialText>
        {
          {
            amount: format(template.amount, 'financial'),
          } as TransObjectLiteral
        }
      </FinancialText>{' '}
      by {{ month: template.month }}
      {template.annual ? ', repeating every year' : ''}
      {template.repeat ? `, repeating every ${template.repeat} months` : ''}
    </Trans>
  );
};
