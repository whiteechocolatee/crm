'use client';

import ResponsiveModal from '@/components/responsive-modal';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import EditTaskFormWrapper from './edit-task-form-wrapper';

function EditTaskModal() {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
}

export default EditTaskModal;
