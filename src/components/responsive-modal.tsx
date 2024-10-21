import { useMedia } from 'react-use';
import { Dialog, DialogContent } from './ui/dialog';
import { Drawer, DrawerContent } from './ui/drawer';

type ResponsiveModalProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

function ResponsiveModal({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) {
  const isDesktop = useMedia('( min-width: 1024px )', true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ResponsiveModal;
