"use client";
import React from "react";
// import { Paperclip, Send, SquarePen, X } from "lucide-react";
// import { useSlate } from 'slate-react';

import { Plate, useEditorState, usePlateId } from "@udecode/plate-common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import {serializeHTMLFromNodes}  from "@udecode/slate-plugins";

// import { Button } from "@/components/ui/button";
// import { MentionCombobox } from "@/components/plate-ui/mention-combobox";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import {TooltipProvider} from "@/components/ui/tooltip"; 

import plugins from "./plugins";

import {styling, formatText, serializeToHtml} from "./utils"; 

// import { slateToHtml } from '@slate-serializers/html'
// import { htmlToSlateConfig, slateToHtmlConfig, payloadSlateToHtmlConfig } from "@slate-serializers/html"
// import { HtmlSerializer } from 'slate-html-serializer';

// import { createPlugins } from "@udecode/plate-common";
// import { serializeHtml } from '@udecode/plate-serializer-html';
// import { ListStyleType } from '@udecode/plate-indent-list';

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "" }],
  },
];




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

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <Plate
          plugins={plugins}
          initialValue={initialValue}
          onChange={onChange}
        // value={content}

        >
          <ClearEditor 
            clear={clear}
            setClear={setClear}
          />
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>
          <div className="my-1" />
          <Editor 
            className="h-[30vh] outline-none border-none focus:border-none bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" 
            placeholder="Type here..."
            
          />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>
          {/* <MentionCombobox items={[]} /> */}
        </Plate>
      </DndProvider>

    </TooltipProvider>
  );
}

// clear editor 
const ClearEditor = ({clear, setClear}: {clear: boolean, setClear: React.Dispatch<boolean>}) => {
  const activeEditorId = usePlateId();
  const editorState = useEditorState(); 

  React.useEffect(() => {
    if (clear) {
      editorState.reset(); 
      setClear(false); 
    }
  }, [clear])

  return (
    <></>
  )
}