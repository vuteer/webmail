import { Modal } from "./modal";

interface ConfirmProps {
    title: string; 
    description: string; 
    isOpen: boolean; 
    onClose: () => void;
    children: React.ReactNode; 
}
 
const Confirm: React.FC<ConfirmProps> = ({title, description, isOpen, onClose, children,}) => {
    return ( 
        <Modal
            title={title}
            description={description}
            isOpen={isOpen}
            onClose={onClose}
        >
            {children}
        </Modal>
     );
}
 
export default Confirm;