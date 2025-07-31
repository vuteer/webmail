"use client";

import { MoreVertical, Pencil, Move, Trash, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { StorageFileType } from "@/types";
import { useState } from "react";
import { CreateFolderModal } from "./create-folder-modal";
import { DeleteModal } from "./delete-modal";
import { downloadFile } from "@/lib/api-calls/files";
import { createToast } from "@/utils/toast";
import { useQueryState } from "nuqs";

export function FileActions({
  setFiles,
  file,
}: {
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  file: StorageFileType;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dir] = useQueryState("dir");

  const handleDownload = async () => {
    setLoading(true);
    const filePathArr = file.path.split("/").filter(Boolean);
    const rs = await downloadFile(
      `${dir || ""}/${filePathArr[filePathArr.length - 1]}`,
    );
    if (rs) {
      createToast("Downloading", "File download has began", "success");
    }
    setLoading(false);
  };
  return (
    <>
      <CreateFolderModal
        open={openRenameModal}
        onClose={() => setOpenRenameModal(false)}
        file={file}
        setFiles={setFiles}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        file={file}
        setFiles={setFiles}
      />
      {/*<MoveModal
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        file={file}
        setFiles={setFiles}
      />*/}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 mr-9 p-1">
          <div className="flex flex-col gap-1">
            {!file.isDirectory ? (
              <Button
                variant="ghost"
                className="justify-start text-sm"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  // setOpenMoveModal(true);]
                  handleDownload();
                }}
                size={"sm"}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            ) : null}
            <Button
              variant="ghost"
              className="justify-start text-sm"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                setOpenRenameModal(true);
              }}
              size={"sm"}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </Button>
            {/*<Button
              variant="ghost"
              className="justify-start text-sm"
              disabled={loading}
              // onClick={onMove}
              size={"sm"}
            >
              <Move className="w-4 h-4 mr-2" />
              Move
            </Button>*/}
            <Button
              variant="ghost"
              className="justify-start text-sm text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
              disabled={loading}
              size={"sm"}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
