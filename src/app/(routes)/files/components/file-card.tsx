"use client";
import dayjs from "dayjs";
import AppCheckbox from "@/components/common/app-checkbox";
import { getFileIcon } from "./get-file-icon";
import { CardContent } from "@/components/ui/card";
import { Heading3, Paragraph } from "@/components/ui/typography";
import { formatBytes } from "@/utils/size";
import { StorageFileType } from "@/types";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatSmartDate } from "@/utils/dates";
import { Separator } from "@/components/ui/separator";
import { useQueryState } from "nuqs";
import { createToast } from "@/utils/toast";
import { FileActions } from "./file-action";
import { useState } from "react";
import { downloadFile } from "@/lib/api-calls/files";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

type Props = {
  file: StorageFileType;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  selectedFiles: StorageFileType[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
};

export const FileCard = ({
  file,
  setFiles,
  selectedFiles,
  setSelectedFiles,
}: Props) => {
  const [dir, setDir] = useQueryState("dir");
  const [downloading, setDownloading] = useState(false);

  const getPath = (path: string) => {
    const pathArr = file.path.split("/");

    return pathArr[pathArr.length - 2];
  };
  const handleDownload = async () => {
    setDownloading(true);
    const filePathArr = file.path.split("/").filter(Boolean);
    const rs = await downloadFile(
      `${dir || ""}/${filePathArr[filePathArr.length - 1]}`,
    );
    if (rs) {
      createToast("Downloading", "File download has began", "success");
    }
    setDownloading(false);
  };
  return (
    <div
      className={cn(
        "rounded-md px-2 py-2 flex items-center gap-3 w-full hover:bg-muted transition-colors cursor-pointer",
        downloading ? "opacity-50 bg-muted cursor-not-allowed" : "",
      )}
      onClick={() => {
        if (file.isDirectory) {
          setDir(`${dir ? dir + "/" : "/"}${getPath(file.path)}`);
        } else {
          if (!downloading) handleDownload();
        }
      }}
    >
      <div className="flex gap-4 items-center flex-1">
        <AppCheckbox
          checked={selectedFiles.filter((f) => f.path === file.path).length > 0}
          onCheck={() => {
            if (selectedFiles.filter((f) => f.path === file.path).length > 0) {
              setSelectedFiles(
                selectedFiles.filter((f) => f.path !== file.path),
              );
            } else {
              setSelectedFiles([...selectedFiles, file]);
            }
          }}
        />
        <div className="text-xl">
          {getFileIcon(file.name, file.isDirectory)}
        </div>
        <div>
          <Heading3 className="p-0 text-sm lg:text-sm font-semibold">
            {file.name}
          </Heading3>
          {downloading && (
            <Paragraph className="text-xs lg:text-xs text-muted-foreground">
              Downloading...
            </Paragraph>
          )}
        </div>
      </div>
      <div className="w-[25%] grid grid-cols-2 gap-2">
        <Paragraph className="text-xs lg:text-sm">
          {file.isDirectory ? "" : formatBytes(file.size)}
        </Paragraph>
        <Paragraph className="text-xs lg:text-sm">
          {formatSmartDate(file.lastModified)}
        </Paragraph>
      </div>
      <FileActions setFiles={setFiles} file={file} />
    </div>
  );
};
