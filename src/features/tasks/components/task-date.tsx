import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';

type TaskDateProps = {
  value: string;
  className?: string;
};

function TaskDate({ value, className = '' }: TaskDateProps) {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let bgColor = 'bg-muted-foreground';

  if (diffInDays <= 3) {
    bgColor = 'bg-red-500';
  } else if (diffInDays <= 7) {
    bgColor = 'bg-orange-500';
  } else if (diffInDays <= 14) {
    bgColor = 'bg-yellow-500';
  }

  return (
    <div className={cn('flex items-center gap-2')}>
      <div className={cn(bgColor, 'size-2 rounded-full')} />
      <span className={cn('truncate font-medium', className)}>
        {format(value, 'PPP', { locale: ru })}
      </span>
    </div>
  );
}

export default TaskDate;
