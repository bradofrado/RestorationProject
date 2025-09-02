import { setStyleFromSettings } from '~/utils/utils';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { PropsOf } from '~/utils/types/polymorphic';
import { FC } from 'react';

export const ParagraphBlock: FC<DataComponent & PropsOf<'p'>> = ({
  data,
  ...rest
}) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );
  return (
    <>
      <p className="py-2" style={setStyleFromSettings(settings)} {...rest}>
        {data?.content || 'Text'}
      </p>
    </>
  );
};
