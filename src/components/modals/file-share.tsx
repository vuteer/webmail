// share file

import { Modal } from "./modal";

interface FileShareModalProps {
    id: string;
    shared: any;
    title: string;
    isOpen: boolean;
    onClose: () => void;
};


const FileShareModal: React.FC<FileShareModalProps> = ({
    id, shared, title, isOpen, onClose
}) => {

    return (
        <Modal
            title={`Share properties for ${title}`}
            isOpen={isOpen}
            onClose={onClose}
        >


        </Modal>
    )
};

export default FileShareModal;