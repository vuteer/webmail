"use client";

import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import {
  FileAudio,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Modal } from "./modal";
 
import { useAuthUser } from "@/auth/authHooks";
import { getCookie } from "@/helpers/cookies";
import { createToast } from "@/utils/toast";
import env from "@/config/env";
import { AttachmentType, FileType } from "@/types";
import { ActualGenerateIcon, categorizeFileType } from "../utils/generate-icon";

interface FileUploadProgress {
  progress: number;
  File: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}


interface ImageUploadProps {
  setFiles: React.Dispatch<AttachmentType[]>;
  files: AttachmentType[];
  isOpen: boolean;
  onClose: () => void;
  folder?: string;
}

const ImageUploadModal: React.FC<ImageUploadProps> = ({
  setFiles,
  files,
  isOpen,
  onClose,
  folder
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);

  const auth = useAuthUser();
  const user = auth();
  const token = getCookie("_auth");

  // feel free to mode all these functions to separate utils
  // here is just for simplicity
  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
    );

    if (progress === 100) {
      setUploadedFiles((prevUploadedFiles) => {
        return [...prevUploadedFiles, file];
      });

      setFilesToUpload((prevUploadProgress) => {
        return prevUploadProgress.filter((item) => item.File !== file);
      });

      return;
    }

    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.map((item) => {
        if (item.File.name === file.name) {
          return {
            ...item,
            progress,
            source: cancelSource,
          };
        } else {
          return item;
        }
      });
    });
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file);
    });

    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((item) => item !== file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFilesToUpload((prevUploadProgress) => {
      return [
        ...prevUploadProgress,
        ...acceptedFiles.map((file) => {
          return {
            progress: 0,
            File: file,
            source: null,
          };
        }),
      ];
    });

    // Custom server upload
    const fileUploadBatch = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);

      const cancelSource = axios.CancelToken.source();

      let res = uploadFileToServer(
        formData,
        (progressEvent: any) => onUploadProgress(progressEvent, file, cancelSource),
        cancelSource, folder || "sent"
      );
 
      return res
      // ?.data?.data?.doc;
    });

    try {
      
      let res = await Promise.all(fileUploadBatch);

      const extract: (prevFiles: AttachmentType[]) => AttachmentType[] = (prevFiles) => {
        const updatedFiles: AttachmentType[] = res.map((curr) => curr?.data?.data?.doc); // Extract the documents
        return [...prevFiles, ...updatedFiles]; // Append new files to the existing ones
      }

      // Update the files state based on the results
      setFiles((prevFiles: AttachmentType[]) => [...extract(prevFiles)]);
      createToast("success", `File${res.length === 1 ? "": "s"} uploaded!`)
    
    } catch (error: any) {
      // console.error("Error uploading files: ", error);
      createToast("error", error?.data?.message || error?.message || "error uploading file")
    }

  }, []);

  const uploadFileToServer = async (formData: any, onUploadProgress: any, cancelSource: any, folder: string) => {

    if (!token || !user) {
      createToast("error", "You need to be logged in to upload a file!");
      return;
    }
    return axios.post(`${env.api_url}/uploads/${user.id}?folder=${folder}`, formData, {

      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token to the headers
      },
      onUploadProgress,
      cancelToken: cancelSource.token,
    });

  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Modal
      title="Upload files"
      isOpen={isOpen}
      onClose={() => {
        setUploadedFiles([]);
        setFilesToUpload([])
        onClose()
      }}
    >
      <div>
        <div>
          <label
            {...getRootProps()}
            className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-secondary border-dashed rounded-lg cursor-pointer hover:bg-secondary "
          >
            <div className=" text-center">
              <div className=" border p-2 rounded-md max-w-min mx-auto">
                <UploadCloud size={20} />
              </div>

              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Drag files</span>
              </p>
              <p className="text-xs text-gray-500">
                Click to upload files &#40;files should be under 10 MB &#41;
              </p>
            </div>
          </label>

          <Input
            {...getInputProps()}
            id="dropzone-file"
            // accept="image/png, image/jpeg"
            accept="image/*, audio/*, video/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/zip"
            type="file"
            className="hidden"
          />
        </div>
 
        <FilesToUpload
          filesToUpload={filesToUpload}
          removeFile={removeFile}
        />
        <UploadedFiles
          uploadedFiles={uploadedFiles}
        />
      </div>
    </Modal>
  );
};

export default ImageUploadModal;


const getFileIconAndColor = (file: File) => {
  if (file.type.includes(FileTypes.Image)) {
    return {
      icon: <FileImage size={20} />
      // color: ImageColor.bgColor,
    };
  }

  if (file.type.includes(FileTypes.Pdf)) {
    return {
      icon: <File size={20} />
      // color: PdfColor.bgColor,
    };
  }

  if (file.type.includes(FileTypes.Audio)) {
    return {
      icon: <FileAudio size={20} />,
      // color: AudioColor.bgColor,
    };
  }

  if (file.type.includes(FileTypes.Video)) {
    return {
      icon: <Video size={20} />
      // color: VideoColor.bgColor,
    };
  }

  return {
    icon: <FolderArchive size={20} />
    // color: OtherColor.bgColor,
  };
};


const FilesToUpload = (
  { filesToUpload, removeFile }:
    {
      filesToUpload: FileUploadProgress[];
      removeFile: (file: File) => void;
    }
) => {
  return (
    <>
      {
        filesToUpload.length > 0 &&
        <div>
          <ScrollArea className="max-h-[20vh]">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress: any) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div>
                        {getFileIconAndColor(fileUploadProgress.File).icon}
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.File.name.slice(0, 25)} - {(fileUploadProgress.File.size / 1000000).toFixed(2)} MB
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <Progress
                          value={fileUploadProgress.progress}
                          className={`
                            bg-gray-500 h-[5px]
                          `}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel(
                            "Upload cancelled"
                          );
                        removeFile(fileUploadProgress.File);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      }
    </>
  )
};


const UploadedFiles = (
  { uploadedFiles }:
    {
      uploadedFiles: File[]
    }
) => {

  return (
    <>
      {
        uploadedFiles.length > 0 && (
          <div>
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Uploaded Files
            </p>
            <div className="space-y-2 pr-3">
              {uploadedFiles.map((file: any) => {
                return (
                  <div
                    key={file.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden group hover:pr-0 pr-2 transition-all"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <ActualGenerateIcon type={categorizeFileType(file.name)}/>
                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {file.name.slice(0, 25)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </>
  )
}