"use client";
import React, { useCallback } from "react";
import { Plate, useEditorState, usePlateId } from "@udecode/plate-common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { TooltipProvider } from "@/components/ui/tooltip";
import plugins from "./plugins";
import { styling, formatText, serializeToHtml } from "./utils";

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "" }],
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

export default function EditorContainer({
  clear,
  setClear,
  setContent,
}: {
  clear: boolean;
  setClear: React.Dispatch<boolean>;
  setContent: React.Dispatch<string>;
}) {
  const onChange = (slate: any) => {
    const serializedToHtml = serializeToHtml(slate);
    setContent(serializedToHtml);
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        // Handle large files: open upload dialog
        openUploadDialog(file);
      } else {
        // Handle small files: append to editor (if needed)
        // This part can be adjusted according to your file handling logic
      }
    });
  }, []);

  const openUploadDialog = (file: File) => {
    // Implement your upload dialog logic here
    console.log("Opening upload dialog for:", file.name);
    // You can open a modal or a file upload component
  };

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <div 
          onDrop={handleDrop} 
          onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
          className="editor-drop-zone" // Optional: Add a class for styling
        >
          <Plate
            plugins={plugins}
            initialValue={initialValue}
            onChange={onChange}
          >
            <ClearEditor clear={clear} setClear={setClear} />
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>
            <div className="my-1" />
            <Editor
              className="h-[30vh] outline-none border-none focus:border-none bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <FloatingToolbar>
              <FloatingToolbarButtons />
            </FloatingToolbar>
          </Plate>
        </div>
      </DndProvider>
    </TooltipProvider>
  );
}

// Clear editor
const ClearEditor = ({ clear, setClear }: { clear: boolean; setClear: React.Dispatch<boolean> }) => {
  const activeEditorId = usePlateId();
  const editorState = useEditorState();

  React.useEffect(() => {
    if (clear) {
      editorState.reset();
      setClear(false);
    }
  }, [clear]);

  return <></>;
};
