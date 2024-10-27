'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';

type DatePickerProps = {
  value: Date | undefined;
  onChange: (value: Date) => void;
  className?: string;
  placeholder?: string;
};

function DatePicker({
  value,
  onChange,
  className,
  placeholder = 'Select date',
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'w-full justify-start px-3 text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, 'PPP') : <span> {placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={date => onChange(date as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
