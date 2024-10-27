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

  let textColor = 'text-muted-foreground';

  if (diffInDays <= 3) {
    textColor = 'text-red-500';
  } else if (diffInDays <= 7) {
    textColor = 'text-orange-500';
  } else if (diffInDays <= 14) {
    textColor = 'text-yellow-500';
  }

  return (
    <div className={textColor}>
      <span className={cn('truncate font-mono font-medium', className)}>
        {format(value, 'PPP', { locale: ru })}
      </span>
    </div>
  );
}

export default TaskDate;
