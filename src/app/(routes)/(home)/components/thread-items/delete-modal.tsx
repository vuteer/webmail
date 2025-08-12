import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

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
  const [sec] = useQueryState("sec");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What would you like to do?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Do you want to move the selected mail to Trash or delete it
          permanently?
        </div>
        <DialogFooter className="grid grid-cols-1 lg:grid-cols-2 gap-2 0">
          <Button
            disabled={sec === "trash" || loading}
            variant="outline"
            onClick={onMoveToTrash}
          >
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
