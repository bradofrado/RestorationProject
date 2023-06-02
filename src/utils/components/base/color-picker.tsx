import {useColorArea, useColorSlider} from '@react-aria/color';
import {type Color, type ColorAreaProps, useColorAreaState, useColorSliderState, parseColor} from '@react-stately/color';
import {useFocusRing} from '@react-aria/focus';
import React, { Fragment } from 'react';
import { VisuallyHidden, useLocale } from 'react-aria';
import { Popover, Transition } from '@headlessui/react';
import {type ColorSliderProps} from '@react-types/color';
import {type HexColor, HexColorSchema} from '~/utils/types/colors';

const SIZE = 192;
const FOCUSED_THUMB_SIZE = 28;
const THUMB_SIZE = 20;
const BORDER_RADIUS = 4;

const getHslaColor = <T extends Color | HexColor>(value: PickerColor<T>): Color => {
  return typeof value == 'string' ? parseColor(value).toFormat('hsla') : value; 
}

const colorToHex = (value: Color): HexColor => {
  return HexColorSchema.parse(value.toString('hexa'));
}

type PickerColor<T extends Color | HexColor> = T;

function ColorArea(props: ColorAreaProps) {
  const inputXRef = React.useRef<HTMLInputElement>(null);
  const inputYRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const state = useColorAreaState(props);

  const { isDisabled } = props;

  const {
    colorAreaProps,
    gradientProps,
    xInputProps,
    yInputProps,
    thumbProps
  } = useColorArea({ ...props, inputXRef, inputYRef, containerRef }, state);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      ref={containerRef}
      {...colorAreaProps}
      style={{
        ...colorAreaProps.style,
        width: SIZE,
        height: SIZE,
        borderRadius: BORDER_RADIUS,
        opacity: isDisabled ? 0.3 : undefined
      }}
    >
      <div
        {...gradientProps}
        style={{
          backgroundColor: isDisabled ? 'rgb(142, 142, 142)' : undefined,
          ...gradientProps.style,
          borderRadius: BORDER_RADIUS,
          height: SIZE,
          width: SIZE
        }}
      />
      <div
        {...thumbProps}
        style={{
          ...thumbProps.style,
          background: isDisabled
            ? 'rgb(142, 142, 142)'
            : state.getDisplayColor().toString('css'),
          border: `2px solid ${isDisabled ? 'rgb(142, 142, 142)' : 'white'}`,
          borderRadius: '50%',
          boxShadow: '0 0 0 1px black, inset 0 0 0 1px black',
          boxSizing: 'border-box',
          height: isFocusVisible ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE,
          transform: 'translate(-50%, -50%)',
          width: isFocusVisible ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE
        }}
      >
        <input ref={inputXRef} {...xInputProps} {...focusProps} />
        <input ref={inputYRef} {...yInputProps} {...focusProps} />
      </div>
    </div>
  );
}

type ColorSwatchProps<T extends Color | HexColor> = {
  value: PickerColor<T>
} & React.ComponentPropsWithoutRef<'div'>
function ColorSwatch <T extends Color | HexColor>(props: ColorSwatchProps<T>) {
  const {
    value,
    ...otherProps
  } = props;
  const color = getHslaColor(value);

  const valueString = color.toString('css');
  return (
    <div
      role="img"
      className="inline-block rounded-sm relative w-10 h-10 overflow-hidden"
      aria-label={valueString}
      {...otherProps}
    >
      <div className="absolute w-full h-full bg-white" />
      <div
        className="absolute w-full h-full"
        style={{
          backgroundColor: valueString
        }} />
    </div>
  );
}

function ColorSlider(props: ColorSliderProps) {
  const { locale } = useLocale();
  const state = useColorSliderState({ ...props, locale });
  const trackRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Default label to the channel name in the current locale
  const label = props.label || state.value.getChannelName(props.channel, locale);

  const { trackProps, thumbProps, inputProps, labelProps, outputProps } =
    useColorSlider({
      ...props,
      label,
      trackRef,
      inputRef
    }, state);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: SIZE
      }}
    >
      {/* Create a flex container for the label and output element. */}
      <div style={{ display: 'flex', alignSelf: 'stretch' }}>
        <label {...labelProps}>{label}</label>
        <output {...outputProps} style={{ flex: '1 0 auto', textAlign: 'end' }}>
          {state.value.formatChannelValue(props.channel, locale)}
        </output>
      </div>
      {/* The track element holds the visible track line and the thumb. */}
      <div
        className="w-full rounded-sm relative"
        {...trackProps}
        ref={trackRef}
        style={{
          height: FOCUSED_THUMB_SIZE
        }}
      >
        <style>
        {`.color-slider-track-background,
        .color-slider-thumb-background {
          background-size: 16px 16px;
          background-position:
            -2px -2px,
            -2px 6px,
            6px -10px,
            -10px -2px;
          background-color: white;
          background-image:
            linear-gradient(-45deg, transparent 75.5%, rgb(188, 188, 188) 75.5%),
            linear-gradient(45deg, transparent 75.5%, rgb(188, 188, 188) 75.5%),
            linear-gradient(-45deg, rgb(188, 188, 188) 25.5%, transparent 25.5%),
            linear-gradient(45deg, rgb(188, 188, 188) 25.5%, transparent 25.5%);
        }`}
        </style>
        <div className="w-full rounded-sm absolute h-full color-slider-track-background"></div>
        <div
          className="w-full rounded-sm absolute h-full"
          style={{
            ...trackProps.style
          }}
        >
        </div>
        <div
          className={`absolute top-[14px] box-border rounded-[50%] border-white border-2 w-5 h-5${isFocusVisible ? ' w-6 h-6' : ''}`}
          {...thumbProps}
          style={{
            ...thumbProps.style
          }}
        >
          <div className="color-slider-thumb-background w-full h-full absolute rounded-[50%]"></div>
          <div
            className="absolute rounded-[50%] w-full h-full"
            style={{
              background: state.getDisplayColor().toString('css')
            }}
          >
          </div>
          <VisuallyHidden>
            <input ref={inputRef} {...inputProps} {...focusProps} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
  );
}

type ColorPickerProps<T extends Color | HexColor> = {
  value: PickerColor<T>,
  onChange: (color: PickerColor<T>) => void
}
type ColorPickerFullProps<T extends Color | HexColor> = {
  preview?: boolean | "true" | "false"
} & ColorPickerProps<T>;
export const ColorPickerFull = <T extends Color | HexColor>({value, onChange, preview=true}: ColorPickerFullProps<T>) => {
  const color = getHslaColor(value);
  const isHex = typeof value == 'string';

  const [
    hChannel,
    sChannel,
    lChannel
  ] = color.getColorChannels();

  const onColorChange = (color: Color) => {
    const value = (isHex ? colorToHex(color) : color) as T;
    onChange(value);
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <ColorArea
            value={color}
            onChange={onColorChange}
            xChannel={sChannel}
            yChannel={lChannel}
          />
          <ColorSlider
            channel={hChannel}
            value={color}
            onChange={onColorChange}
          />
          <ColorSlider
            channel="alpha"
            value={color}
            onChange={onColorChange}
          />
        </div>
        {(preview == true || preview == "true") && <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '6px'
            }}
          >
            <ColorSwatch
              value={color.withChannelValue('alpha', 1)}
              aria-label={`current color swatch: ${color.toString('rgb')}`}
            />
            <ColorSwatch
              value={color}
              aria-label={`current color swatch with alpha channel: ${
                color.toString('rgba')
              }`}
            />
          </div>
        </div>}
      </div>
    </>
  );
}

const ColorPicker = <T extends Color | HexColor>({value, onChange}: ColorPickerProps<T>) => {
  return <>
    <Popover className="relative">
      {() => (
        <>
          <Popover.Button>
            <ColorSwatch value={value} aria-label={`current color swatch: ${value.toString('rgb')}`}/>
          </Popover.Button>
          <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <ColorPickerFull value={value} onChange={onChange} preview="false"/>
              </Popover.Panel>
            </Transition>
        </>
      )}
    </Popover>
  </>
}

export default ColorPicker;