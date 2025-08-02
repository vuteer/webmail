import React from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

import AppCheckbox from "@/components/common/app-checkbox";
import { Separator } from "@/components/ui/separator";
import { Heading4 } from "@/components/ui/typography";
import { FileSkeleton } from "./file-skeleton";
import { FileCard } from "./file-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import useMounted from "@/hooks/useMounted";
import { getBaseFiles, getFilesInFolder } from "@/lib/api-calls/files";
import { StorageFileType } from "@/types";
import { CreateFolderModal } from "./create-folder-modal";
import { MoreVertical, Trash, Trash2 } from "lucide-react";
import { UploadFilesModal } from "./upload-file";
import { DeleteMultipleModal } from "./delete-modal";

interface FolderProps {
  refresh: boolean;
  openFolderModal: boolean;
  setOpenFolderModal: React.Dispatch<React.SetStateAction<boolean>>;
  openUploadModal: boolean;
  setOpenUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Folder: React.FC<FolderProps> = ({
  refresh,
  openFolderModal,
  setOpenFolderModal,
  openUploadModal,
  setOpenUploadModal,
}) => {
  const mounted = useMounted();
  const [files, setFiles] = React.useState<StorageFileType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<StorageFileType[]>(
    [],
  );
  const [dir] = useQueryState("dir");
  const router = useRouter();

  const fetchFiles = async () => {
    setLoading(true);
    const res = dir ? await getFilesInFolder(dir) : await getBaseFiles();
    if (res) setFiles(res);
    setLoading(false);
    // setRefresh(false);
  };

  React.useEffect(() => {
    if (!mounted) return;
    fetchFiles();
  }, [refresh, mounted, dir]);

  if (!mounted) return null;

  return (
    <>
      <CreateFolderModal
        open={openFolderModal}
        onClose={() => setOpenFolderModal(false)}
        setFiles={setFiles}
      />
      <UploadFilesModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        setFiles={setFiles}
      />

      <div className="px-2 flex justify-between items-center">
        <div className="flex gap-4 items-center flex-1">
          <AppCheckbox
            checked={selectedFiles.length === files.length && files.length > 0}
            onCheck={() => {
              if (selectedFiles.length === files.length) {
                setSelectedFiles([]);
              } else {
                setSelectedFiles([...files]);
              }
            }}
          />
          <div className="w-6 h-4" />
          <Heading4 className=" text-xs lg:text-sm">Name</Heading4>
          {selectedFiles.length > 0 ? (
            <DeleteMultiple
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              setFiles={setFiles}
            />
          ) : null}
        </div>
        <div className="w-[26%] grid grid-cols-2 gap-2">
          <Heading4 className="text-xs lg:text-sm">Size</Heading4>
          <Heading4 className="text-sm lg:text-sm">Modified</Heading4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className=" text-transparent"
          disabled
        >
          <MoreVertical className="h-4 w-4 text-transparent" />
        </Button>
      </div>
      <Separator />

      <div className="h-[60vh] overflow-y-auto space-y-2 pb-7">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <FileSkeleton key={i} />)
          : files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                setSelectedFiles={setSelectedFiles}
                selectedFiles={selectedFiles}
                setFiles={setFiles}
              />
            ))}

        {!loading && files.length === 0 ? (
          <Card className="flex flex-col gap-3 justify-center items-center h-full">
            <Heading4 className="text-xs lg:text-sm">No files found</Heading4>
            <Button onClick={() => router.back()} size="sm">
              Go Back
            </Button>
          </Card>
        ) : null}
      </div>
    </>
  );
};

const DeleteMultiple = ({
  selectedFiles,
  setSelectedFiles,
  setFiles,
}: {
  selectedFiles: StorageFileType[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  return (
    <>
      <DeleteMultipleModal
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        setFiles={setFiles}
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
      <button
        onClick={() => setOpenDeleteModal(true)}
        // disabled={loading}
        className="inline-flex h-7 px-2 items-center justify-center gap-1 overflow-hidden rounded-lg border border-[#FCCDD5] bg-[#FDE4E9] dark:border-[#6E2532] dark:bg-[#411D23]"
      >
        <Trash className="fill-[#F43F5E]" size={16} />
        <span className="text-xs">Delete Selected</span>
      </button>
    </>
  );
};
