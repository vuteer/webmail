import AppCheckbox from "@/components/common/app-checkbox";
import { Separator } from "@/components/ui/separator";
import { Heading4 } from "@/components/ui/typography";
import useMounted from "@/hooks/useMounted";
import { getBaseFiles } from "@/lib/api-calls/files";
import React from "react";
import { FileSkeleton } from "./file-skeleton";
import { FileCard } from "./file-card";
import { StorageFileType } from "@/types";

interface FolderProps {
  path?: string;
  refresh: boolean;
  // setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Folder: React.FC<FolderProps> = ({ path, refresh }) => {
  const mounted = useMounted();
  const [files, setFiles] = React.useState<StorageFileType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<StorageFileType[]>(
    [],
  );

  const fetchFiles = async () => {
    setLoading(true);
    const res = await getBaseFiles();
    if (res) setFiles(res);
    setLoading(false);
    // setRefresh(false);
  };

  React.useEffect(() => {
    if (!mounted) return;
    fetchFiles();
  }, [refresh, mounted]);

  if (!mounted) return null;

  return (
    <>
      <div className="px-2 flex justify-between items-center">
        <div className="flex gap-4 items-center flex-1">
          <AppCheckbox
            checked={selectedFiles.length === files.length}
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
        </div>
        <div className="w-[200px] grid grid-cols-2 gap-2">
          <Heading4 className="text-xs lg:text-sm">Size</Heading4>
          <Heading4 className="text-sm lg:text-sm">Modified</Heading4>
        </div>
      </div>
      <Separator />

      <div className="h-[60vh] overflow-y-auto  grid gap-4 pb-7">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <FileSkeleton key={i} />)
          : files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                setSelectedFiles={setSelectedFiles}
                selectedFiles={selectedFiles}
              />
            ))}
      </div>
    </>
  );
};
