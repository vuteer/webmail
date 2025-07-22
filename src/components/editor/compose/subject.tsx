import { Loader } from "lucide-react";
import { Sparkles } from "@/components/icons/icons";

interface SubjectProps {
  subjectInput: string;
  setHasUnsavedChanges: any;
  setValue: any;
  isLoading: boolean;
  isGeneratingSubject: boolean;
  handleGenerateSubject: any;
}

export const Subject = ({
  subjectInput,
  setHasUnsavedChanges,
  setValue,
  isLoading,
  isGeneratingSubject,
  handleGenerateSubject,
}: SubjectProps) => {
  return (
    <>
      {/* Subject */}
      <div className="flex items-center gap-2 border-b p-3">
        <p className="text-sm font-medium text-[#8C8C8C]">Subject:</p>
        <input
          className="h-4 w-full bg-transparent text-sm font-normal leading-normal text-black placeholder:text-[#797979] focus:outline-none dark:text-white/90"
          placeholder="Re: Design review feedback"
          value={subjectInput}
          onChange={(e) => {
            setValue("subject", e.target.value);
            setHasUnsavedChanges(true);
          }}
        />
        <button
          onClick={handleGenerateSubject}
          disabled={isLoading || isGeneratingSubject}
        >
          <div className="flex items-center justify-center gap-2.5 pl-0.5">
            <div className="flex h-5 items-center justify-center gap-1 rounded-sm">
              {isGeneratingSubject ? (
                <Loader className="h-3.5 w-3.5 animate-spin fill-black dark:fill-white" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 fill-black dark:fill-white" />
              )}
            </div>
          </div>
        </button>
      </div>
    </>
  );
};
