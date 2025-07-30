"use client";
import dayjs from "dayjs";
import AppCheckbox from "@/components/common/app-checkbox";
import { getFileIcon } from "./get-file-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Paragraph } from "@/components/ui/typography";
import { formatBytes } from "@/utils/size";
import { StorageFileType } from "@/types";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatSmartDate } from "@/utils/dates";
import { Separator } from "@/components/ui/separator";
import { useQueryState } from "nuqs";
import { createToast } from "@/utils/toast";

dayjs.extend(relativeTime);

type Props = {
  file: StorageFileType;
  selectedFiles: StorageFileType[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
};

export const FileCard = ({ file, selectedFiles, setSelectedFiles }: Props) => {
  const [dir, setDir] = useQueryState("dir");
  //"/remote.php/dav/files/68778b3f50825ec4871d8ffd/Documents/"
  const getPath = (path: string) => {
    const pathArr = file.path.split("/");

    return pathArr[pathArr.length - 2];
  };
  return (
    <div
      className="rounded-md px-2 py-2 flex items-center gap-3 w-full hover:bg-muted transition-colors cursor-pointer"
      onClick={() => {
        if (file.isDirectory) {
          setDir(`${dir ? dir + "/" : "/"}${getPath(file.path)}`);
        } else {
          createToast("Open File", "It works", "success");
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
        <CardContent className="p-0 text-sm">{file.name}</CardContent>
      </div>
      <div className="w-[200px] grid grid-cols-2 gap-2">
        <Paragraph className="text-xs lg:text-sm">
          {file.isDirectory ? "" : formatBytes(file.size)}
        </Paragraph>
        <Paragraph className="text-xs lg:text-sm">
          {formatSmartDate(file.lastModified)}
        </Paragraph>
      </div>
    </div>
  );
};
