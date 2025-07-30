import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
} from "lucide-react";
import { FaFolder } from "react-icons/fa";

export function getFileIcon(name: string, isDirectory: boolean) {
  if (isDirectory) return <FaFolder className="text-yellow-500" />;
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return <FileText className="text-red-600" />;
    case "md":
    case "txt":
      return <FileText className="text-gray-700" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <FileImage className="text-purple-500" />;
    case "mp4":
    case "webm":
      return <FileVideo className="text-indigo-600" />;
    case "mp3":
    case "wav":
      return <FileAudio className="text-pink-500" />;
    case "zip":
    case "rar":
      return <FileArchive className="text-orange-500" />;
    default:
      return <File className="text-gray-500" />;
  }
}
