import React, { useState } from 'react';
import { Task } from '../types';
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from 'date-fns';
import { uk, ru } from 'date-fns/locale';
import {
  Calendar as CalendarComponent,
  dateFnsLocalizer,
} from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './data-calendar.css';
import EventCard from './event-card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const locales = {
  'uk-UA': ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type DataCalendarProps = {
  data: Task[];
};

type CustomToolbarProps = {
  date: Date;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
};

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button
        variant="secondary"
        className="flex items-center"
        size="icon"
        onClick={() => onNavigate('PREV')}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="flex h-8 w-full items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto">
        <Calendar className="mr-2 size-4 text-muted-foreground" />
        <p className="text-sm">
          {format(date, 'yyyy MMMM', { locale: locales['uk-UA'] })}
        </p>
      </div>
      <Button
        variant="secondary"
        className="flex items-center"
        size="icon"
        onClick={() => onNavigate('NEXT')}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date(),
  );

  const events = data.map(task => ({
    title: task.name,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setValue(subMonths(value, 1));
    } else if (action === 'NEXT') {
      setValue(addMonths(value, 1));
    } else if (action === 'TODAY') {
      setValue(new Date());
    }
  };

  return (
    <CalendarComponent
      localizer={localizer}
      views={['month']}
      defaultView="month"
      date={value}
      toolbar
      showAllEvents
      className="h-full"
      events={events}
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => {
          return localizer?.format(date, 'EEE', culture) ?? '';
        },
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: ({ date, label, localizer }) => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
}

export default DataCalendar;
