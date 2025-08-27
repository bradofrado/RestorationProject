import { useRef } from 'react';
import { useRangeCalendarState } from '@react-stately/calendar';
import { useRangeCalendar } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import {
  CalendarDate,
  createCalendar,
  getDayOfWeek,
  getLocalTimeZone,
  getWeeksInMonth,
  isSameDay,
} from '@internationalized/date';
import {
  type CalendarState,
  type DateFieldState,
  type DatePickerStateOptions,
  type DateSegment,
  type OverlayTriggerState,
  type RangeCalendarState,
  useCalendarState,
  useDateFieldState,
  useDatePickerState,
  useDateRangePickerState,
} from 'react-stately';
import {
  type AriaButtonProps,
  type AriaCalendarGridProps,
  type AriaDialogProps,
  type AriaPopoverProps,
  type CalendarProps,
  type DateValue,
  DismissButton,
  Overlay,
  type RangeCalendarProps,
  mergeProps,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDateField,
  useDatePicker,
  useDateRangePicker,
  useDateSegment,
  useDialog,
  useFocusRing,
  usePopover,
  type DateRange,
} from 'react-aria';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import React from 'react';
import { type DatePickerProps } from '@react-types/datepicker';

export const DatePicker = <T extends DateValue>(
  props: DatePickerStateOptions<T>
) => {
  const state = useDatePickerState(props);
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref);

  return (
    <div className="relative text-left">
      <span {...labelProps} className="text-sm text-gray-800">
        {props.label}
      </span>
      <div {...groupProps} ref={ref} className="group flex">
        <div className="relative flex items-center rounded-l-md border border-gray-300 bg-white p-1 pr-10 transition-colors group-focus-within:border-primary group-hover:border-gray-400 group-focus-within:group-hover:border-primary">
          <DateField {...fieldProps} />
          {state.validationState === 'invalid' && (
            <ExclamationIcon className="absolute right-1 h-6 w-6 text-red-500" />
          )}
        </div>
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <CalendarIcon className="h-5 w-5 text-gray-700 group-focus-within:text-primary" />
        </FieldButton>
      </div>
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
};

type DateRangePickerProps = {
  start: Date | null;
  end: Date | null;
  onChange: (start: Date, end?: Date) => void;
};
export const DateRangePicker = (props: DateRangePickerProps) => {
  const options = {
    value:
      props.start && props.end
        ? {
            start: new CalendarDate(
              props.start.getFullYear(),
              props.start.getMonth() + 1,
              props.start.getDate()
            ),
            end: new CalendarDate(
              props.end.getFullYear(),
              props.end.getMonth() + 1,
              props.end.getDate()
            ),
          }
        : null,
    onChange: (range: DateRange | null) => {
      if (range) {
        props.onChange(
          range.start.toDate(getLocalTimeZone()),
          range.end?.toDate(getLocalTimeZone())
        );
      }
    },
  };
  const state = useDateRangePickerState(options);
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    //labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(options, state, ref);

  return (
    <div className="relative text-left">
      {/* <span {...labelProps} className="text-sm text-gray-800">
        {props.label}
      </span> */}
      <div {...groupProps} ref={ref} className="group flex">
        <div className="relative flex rounded-l-md border border-gray-300 bg-white p-1 pr-10 transition-colors group-focus-within:border-primary group-hover:border-gray-400 group-focus-within:group-hover:border-primary">
          <DateField {...startFieldProps} />
          <span aria-hidden="true" className="px-2">
            –
          </span>
          <DateField {...endFieldProps} />
          {state.validationState === 'invalid' && (
            <ExclamationIcon className="absolute right-1 h-6 w-6 text-red-500" />
          )}
        </div>
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <CalendarIcon className="h-5 w-5 text-gray-700 group-focus-within:text-primary" />
        </FieldButton>
      </div>
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <RangeCalendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
};

export const DateField = <T extends DateValue>(props: DatePickerProps<T>) => {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
};

function DateSegment({
  segment,
  state,
}: {
  segment: DateSegment;
  state: DateFieldState;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null
            ? `${String(segment.maxValue).length}ch`
            : undefined,
      }}
      className={`group box-content rounded-sm px-0.5 text-right tabular-nums outline-none focus:bg-primary focus:text-white ${
        !segment.isEditable ? 'text-gray-500' : 'text-gray-800'
      }`}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden="true"
        className="block w-full text-center italic text-gray-500 group-focus:text-white"
        style={{
          visibility: segment.isPlaceholder ? undefined : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none',
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
}

export const Calendar = <T extends DateValue>(props: CalendarProps<T>) => {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(
      props,
      state
      //ref
    );

  return (
    <div {...calendarProps} ref={ref} className="inline-block text-gray-800">
      <div className="flex items-center pb-4">
        <h2 className="ml-2 flex-1 text-xl font-bold">{title}</h2>
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon className="h-6 w-6" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="h-6 w-6" />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
};

export const RangeCalendar = <T extends DateValue>(
  props: RangeCalendarProps<T>
) => {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref} className="inline-block">
      <div className="flex items-center pb-4">
        <h2 className="ml-2 flex-1 text-xl font-bold">{title}</h2>
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon className="h-6 w-6" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="h-6 w-6" />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
};

type CalendarGridProps = {
  state: CalendarState | RangeCalendarState;
} & AriaCalendarGridProps;
export const CalendarGrid = ({ state, ...props }: CalendarGridProps) => {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-gray-600">
        <tr>
          {weekDays.map((day, index) => (
            <th className="text-center" key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type CalendarCellProps = {
  date: CalendarDate;
  state: CalendarState | RangeCalendarState;
};
export function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart =
    'highlightedRange' in state && state.highlightedRange
      ? isSameDay(date, state.highlightedRange.start)
      : isSelected;
  const isSelectionEnd =
    'highlightedRange' in state && state.highlightedRange
      ? isSameDay(date, state.highlightedRange.end)
      : isSelected;

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={`relative py-0.5 ${isFocusVisible ? 'z-10' : 'z-0'}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={`group h-10 w-10 outline-none ${
          isRoundedLeft ? 'rounded-l-full' : ''
        } ${isRoundedRight ? 'rounded-r-full' : ''} ${
          isSelected
            ? isInvalid
              ? 'bg-red-300'
              : 'bg-primary bg-opacity-30'
            : ''
        } ${isDisabled ? 'disabled' : ''}`}
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-full ${
            isDisabled && !isInvalid ? 'text-gray-400' : ''
          } ${
            // Focus ring, visible while the cell has keyboard focus.
            isFocusVisible
              ? 'group-focus:z-2 ring-2 ring-primary ring-offset-2'
              : ''
          } ${
            // Darker selection background for the start and end.
            isSelectionStart || isSelectionEnd
              ? isInvalid
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary text-white hover:bg-primary hover:bg-opacity-90'
              : ''
          } ${
            // Hover state for cells in the middle of the range.
            isSelected && !isDisabled && !(isSelectionStart || isSelectionEnd)
              ? isInvalid
                ? 'hover:bg-red-400'
                : 'hover:bg-primary hover:bg-opacity-30'
              : ''
          } ${
            // Hover state for non-selected cells.
            !isSelected && !isDisabled
              ? 'hover:bg-primary hover:bg-opacity-10'
              : ''
          } cursor-default`}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
}

type DialogProps = AriaDialogProps & React.PropsWithChildren;
export function Dialog({ children, ...props }: DialogProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { dialogProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref}>
      {children}
    </div>
  );
}

type PopoverProps = React.PropsWithChildren<
  Omit<AriaPopoverProps, 'popoverRef'> & {
    state: OverlayTriggerState;
  }
>;
export const Popover = (props: PopoverProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { children, state } = props;

  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef: ref,
    },
    state
  );

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0" />
      <div
        {...popoverProps}
        ref={ref}
        className="absolute top-full z-10 mt-2 rounded-md border border-gray-300 bg-white p-8 shadow-lg"
      >
        <DismissButton onDismiss={state.close.bind(state)} />
        {children}
        <DismissButton onDismiss={state.close.bind(state)} />
      </div>
    </Overlay>
  );
};

export function CalendarButton(props: AriaButtonProps<'button'>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={`rounded-full p-2 ${props.isDisabled ? 'text-gray-400' : ''} ${
        !props.isDisabled ? 'hover:opacity-10 active:opacity-20' : ''
      } outline-none ${
        isFocusVisible ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      {props.children}
    </button>
  );
}

type FieldProps = AriaButtonProps<'button'> & {
  isPressed: boolean;
};
export function FieldButton(props: FieldProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={`-ml-px rounded-r-md border px-2 outline-none transition-colors group-focus-within:border-primary group-focus-within:group-hover:border-primary ${
        isPressed || props.isPressed
          ? 'border-gray-400 bg-gray-200'
          : 'border-gray-300 bg-gray-50 group-hover:border-gray-400'
      }`}
    >
      {props.children}
    </button>
  );
}
