import React, { useState } from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import DottedSeparator from '@/components/dotted-separator';
import { useUpdateTask } from '../api/use-update-task';
import { Textarea } from '@/components/ui/textarea';

type TaskDescriptionProps = {
  task: Task;
};

function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState<string>('');

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: {
          description: value,
        },
        param: {
          taskId: task.$id,
        },
      },
      {
        onSuccess: () => {
          setIsEditable(false);
        },
      },
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Описание</p>
        <Button
          onClick={() => setIsEditable(prev => !prev)}
          size="sm"
          variant="secondary"
        >
          {isEditable ? (
            <X className="mr-2 size-4" />
          ) : (
            <Pencil className="mr-2 size-4" />
          )}
          {isEditable ? 'Отменить' : 'Редактировать'}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditable ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Сделать волосатого на похер"
            value={value || task.description}
            rows={4}
            onChange={e => setValue(e.target.value)}
          />
          <Button
            onClick={handleSave}
            className="ml-auto w-fit"
            disabled={isPending}
            size="sm"
          >
            {isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      ) : (
        <div className="">
          {task.description || (
            <span className="text-muted-foreground">Нет описания</span>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskDescription;
