'use client';

import React from 'react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import ResponsiveModal from '@/components/responsive-modal';
import CreateTaskFormWrapper from './create-task-form-wrapper';

function CreateTaskModal() {
  const { isOpen, setIsOpen } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={() => setIsOpen(false)} />
    </ResponsiveModal>
  );
}

export default CreateTaskModal;
