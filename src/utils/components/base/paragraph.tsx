import { type PropsOf } from '~/utils/types/polymorphic';
import { setStyleFromSettings } from '~/utils/utils';
import { type SettingsComponentSettings } from './header';

export type ParagraphProps = PropsOf<'p'> & {
  settings?: SettingsComponentSettings;
};
const Paragraph = ({
  children,
  settings = { margin: 0, color: '#fff' },
  ...rest
}: ParagraphProps) => {
  return (
    <>
      <p {...rest} style={setStyleFromSettings(settings)}>
        {children}
      </p>
    </>
  );
};

export default Paragraph;
