import { Trans } from 'react-i18next';

import { Text } from '@actual-app/components/text';

import type { RemainderTemplate } from 'loot-core/types/models/templates';

type RemainderAutomationReadOnlyProps = {
  template: RemainderTemplate;
};

export const RemainderAutomationReadOnly = ({
  template,
}: RemainderAutomationReadOnlyProps) => {
  const weight = template.weight ?? 1;

  return (
    <Text>
      {weight === 1 ? (
        <Trans>Distribute remaining funds to this category</Trans>
      ) : (
        <Trans>
          Distribute remaining funds (weight: {{ weight }})
        </Trans>
      )}
    </Text>
  );
};
