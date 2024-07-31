import { Button } from "../ui/button";
import { Modal } from "./modal";

interface SoundQueryModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    cRef: React.RefObject<HTMLButtonElement>; 
}

const SoundQueryModal: React.FC<SoundQueryModalProps> = ({isOpen, onClose, cRef}) => (
    <Modal
        title="Playing sound"
        description="This tab will play sounds from incoming mails. Click Okay below to allow or cancel if you prefer not to."
        isOpen={isOpen}
        onClose={onClose}
    >
        <div className="flex justify-end">
            <Button onClick={() => {cRef.current?.click(); onClose()}} className="min-w-[150px]">
                Okay
            </Button>
        </div>
    </Modal>
); 

export default SoundQueryModal; 