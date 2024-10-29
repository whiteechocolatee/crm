import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

type AnalyticsCardProps = {
  title: string;
  value: number;
  variant: 'up' | 'down';
  increasingValue: number;
};

function AnalyticsCard({
  title,
  value,
  variant,
  increasingValue,
}: AnalyticsCardProps) {
  const iconColor = variant === 'up' ? 'text-emerald-600' : 'text-red-600';
  const increaseValueColor =
    variant === 'up' ? 'text-emerald-600' : 'text-red-600';
  const Icon = variant === 'up' ? FaCaretUp : FaCaretDown;

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 overflow-hidden font-medium">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={iconColor} />
            <span
              className={cn(
                increaseValueColor,
                'truncate text-base font-medium',
              )}
            >
              {increasingValue}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default AnalyticsCard;
