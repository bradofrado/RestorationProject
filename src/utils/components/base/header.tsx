import {type PropsOf} from '~/utils/types/polymorphic';
import {HexColorSchema} from '~/utils/types/colors';
import {setStyleFromSettings} from '~/utils/utils';
import { z } from 'zod';
import { type ContentEditable } from '../edit/add-component';

export const SettingsComponentSettingsSchema = z.object({
	margin: z.number(),
	color: HexColorSchema
})

export type SettingsComponentSettings = z.infer<typeof SettingsComponentSettingsSchema>;
const HeaderLevelsArray = [1, 2, 3, 4, 5, 6] as const;
export const HeaderLevelsSchema = z.custom<HeaderLevels>((data) => typeof data == 'number' && (HeaderLevelsArray as readonly number[]).includes(data));
export type HeaderLevels = typeof HeaderLevelsArray[number];
export const HeaderSettingsSchema = SettingsComponentSettingsSchema.extend({
	level: HeaderLevelsSchema
})
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>

type Headers = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeaderProps = {
	settings?: HeaderSettings,
	level?: HeaderLevels,
	className?: string
} & React.PropsWithChildren<ContentEditable> & PropsOf<Headers>

const Header = ({children, className, settings={margin: 0, level: 2, color: '#000'}, level, ...rest}: HeaderProps): JSX.Element => {
	level = level ?? settings.level;
	const size: Record<Headers, string> = {
		"h1": "text-3xl font-bold",
		"h2": "text-xl",
		"h3": "text-l",
		"h4": "text-m",
		"h5": "text-s",
		"h6": "text-xs"
	}
	const headerMapping: Record<HeaderLevels, Headers> = {
		1: 'h1',
		2: 'h2',
		3: 'h3',
		4: 'h4',
		5: 'h5',
		6: 'h6'
	}
	const Component = headerMapping[level];
	return (
		<Component className={`${size[Component]} font-bold leading-9 tracking-tight text-gray-900 ${className || ''}`} {...rest}
			style={setStyleFromSettings(settings)}>
			{children}
		</Component>
	);
}

export default Header;