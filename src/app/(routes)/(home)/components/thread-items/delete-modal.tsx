import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MailTrashModalProps = {
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onMoveToTrash: () => Promise<void>;
  onDelete: () => void;
};

export const MailTrashModal = ({
  loading,
  isOpen,
  onClose,
  onMoveToTrash,
  onDelete,
}: MailTrashModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What would you like to do?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Do you want to move the selected mail to Trash or delete it permanently?
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button disabled={loading} variant="outline" onClick={onMoveToTrash}>
            Move to Trash
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onDelete}>
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
