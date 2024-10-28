import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

import { Task, TaskStatus } from '../types';
import KanbanColumnHeader from './kanban-column-header';
import KanbanCard from './kanban-card';

type DataKanbanProps = {
  data: Task[];
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[],
  ) => void;
};

type TaskState = {
  [key in TaskStatus]: Task[];
};

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach(task => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach(status => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position,
      );
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach(task => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach(status => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };

        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTasks] = sourceColumn.splice(source.index, 1);

        if (!movedTasks) {
          console.error('Task not found at the source index');

          return prevTasks;
        }

        const updateMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTasks, status: destinationStatus }
            : movedTasks;

        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destinationStatus]];
        destColumn.splice(destination.index, 0, updateMovedTask);
        newTasks[destinationStatus] = destColumn;

        updatesPayload = [];

        updatesPayload.push({
          $id: updateMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1_000, 1_000_000),
        });

        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updateMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1_000, 1_000_000);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                position: newPosition,
                status: destinationStatus,
              });
            }
          }
        });

        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1_000, 1_000_000);
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  position: newPosition,
                  status: sourceStatus,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map(board => {
          return (
            <div
              className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
              key={board}
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5 mb-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded-md bg-background p-2.5 mb-2"
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default DataKanban;
