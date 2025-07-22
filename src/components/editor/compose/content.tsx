import { EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface EmailContentProps {
  editorClassName?: string;
  aiGeneratedMessage?: any;
  editor: any;
}
export const EmailContent = ({
  editorClassName,
  aiGeneratedMessage,
  editor,
}: EmailContentProps) => {
  return (
    <>
      {/* Message Content */}
      <div className="grow self-stretch overflow-y-auto border-t bg-[#FFFFFF] px-3 py-3 outline-white/5 dark:bg-[#202020]">
        <div
          onClick={() => {
            editor.commands.focus();
          }}
          className={cn(
            `max-h-[300px] min-h-[200px] w-full`,
            editorClassName,
            aiGeneratedMessage !== null ? "blur-sm" : "",
          )}
        >
          <EditorContent placeholder="Start your email here" editor={editor} className="text-sm h-full w-full" />
        </div>
      </div>
    </>
  );
};
