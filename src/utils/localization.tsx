'use client';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </MuiLocalizationProvider>
  );
};
