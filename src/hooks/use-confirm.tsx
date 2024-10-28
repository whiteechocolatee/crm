'use client';

import ResponsiveModal from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { useState } from 'react';

export const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise(resolve => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  function ConfirmationDialog() {
    return (
      <ResponsiveModal open={promise !== null}>
        <Card className="h-full w-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0 text-xl font-bold">{title}</CardHeader>
            <CardDescription>{message}</CardDescription>
          </CardContent>
          <div className="flex w-full flex-col items-end justify-center gap-x-2 gap-y-2 p-4 lg:flex-row">
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleCancel}
            >
              Отменить
            </Button>
            <Button
              className="w-full"
              onClick={handleConfirm}
              variant="destructive"
            >
              Продолжить
            </Button>
          </div>
        </Card>
      </ResponsiveModal>
    );
  }

  return [ConfirmationDialog, confirm];
};
