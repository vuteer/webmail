import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { cn } from "@/lib/utils";
import { ToItems } from "./to";
import { Subject } from "./subject";
import { EmailContent } from "./content";
import { createToast } from "@/utils/toast";
import useComposeEditor from "@/hooks/use-compose-editor";
import { BottomActions } from "./actions";
import { useSession } from "@/lib/auth-client";
import useMounted from "@/hooks/useMounted";
import { useQueryState } from "nuqs";
// import { createDraft } from "@/lib/api-calls/mails";
import { sendingMail } from "./send";
import { useMailStoreState } from "@/stores/mail-store";

interface EmailComposeProps {
  initialTo?: string[];
  initialCc?: string[];
  initialBcc?: string[];
  initialSubject?: string;
  initialMessage?: string;
  initialAttachments?: File[];
  replyingTo?: string;
  onSendEmail: (data: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    message: string;
    attachments: File[];
    fromEmail?: string;
    draftId: string | null;
  }) => Promise<string>;
  onClose?: () => void;
  className?: string;
  autofocus?: boolean;
  settingsLoading?: boolean;
  editorClassName?: string;
  mode?: "reply" | "forward" | "new" | "replyAll";
}

const schema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  attachments: z.array(z.any()).optional(),
  headers: z.any().optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  threadId: z.string().optional(),
  fromEmail: z.string().optional(),
});

export const EmailCompose = ({
  initialTo = [],
  initialCc = [],
  initialBcc = [],
  initialSubject = "",
  initialMessage = "",
  initialAttachments = [],
  onSendEmail,
  onClose,
  className,
  autofocus = false,
  settingsLoading = false,
  replyingTo,
  editorClassName,
}: EmailComposeProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const mounted = useMounted();
  const { mails, mailsLoading } = useMailStoreState();

  const [threadId] = useQueryState("threadId");
  const [draftId, setDraftId] = useQueryState("draftId");
  const [mode] = useQueryState("mode");

  const [activeReplyId, setActiveReplyId] = useQueryState("activeReplyId");

  const [showCc, setShowCc] = useState(initialCc.length > 0);
  const [showBcc, setShowBcc] = useState(initialBcc.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // const [messageLength, setMessageLength] = useState(0);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState<string | null>(
    null,
  );
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false);
  const [isAddingRecipients, setIsAddingRecipients] = useState(false);
  const [isAddingCcRecipients, setIsAddingCcRecipients] = useState(false);
  const [isAddingBccRecipients, setIsAddingBccRecipients] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);

  const toWrapperRef = useRef<HTMLDivElement>(null);
  const ccWrapperRef = useRef<HTMLDivElement>(null);
  const bccWrapperRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const ccInputRef = useRef<HTMLInputElement>(null);
  const bccInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: initialTo,
      cc: initialCc,
      bcc: initialBcc,
      subject:
        (mode === "forward" ? "FWD: " : mode?.includes("reply") ? "RE: " : "") +
        initialSubject,
      message: initialMessage,
      attachments: initialAttachments,
      fromEmail: session?.user?.email || "",
    },
  });

  const { watch, setValue, getValues } = form;
  const toEmails = watch("to");
  const ccEmails = watch("cc");
  const bccEmails = watch("bcc");
  const subjectInput = watch("subject");
  const attachments = watch("attachments");
  // const fromEmail = watch("fromEmail");

  useEffect(() => {
    if (!mounted) return;
    form.reset({
      to: initialTo,
      cc: initialCc,
      bcc: initialBcc,
      subject:
        (mode === "forward" ? "FWD: " : mode?.includes("reply") ? "RE: " : "") +
        initialSubject,
      message: initialMessage,
      attachments: initialAttachments,
      fromEmail: session?.user?.email || "",
    });
  }, [mode, mounted]);

  useEffect(() => {
    if (mailsLoading || !activeReplyId) return;
    // get replyTo based on activeReplyId
    const m: any = mails.find((ml) => ml.messageId === activeReplyId);
    if (m) setReplyToMessage(m);
  }, [mails, mailsLoading, activeReplyId]);

  // editor
  const editor: any = useComposeEditor({
    initialValue: initialMessage,
    isReadOnly: isLoading,
    onLengthChange: (length: number) => {
      setHasUnsavedChanges(true);
      // setMessageLength(length);
    },
    onModEnter: () => {
      void handleSend();
      return true;
    },
    onAttachmentsChange: (files) => {
      handleAttachment(files, setValue, attachments, setHasUnsavedChanges);
    },
    placeholder: "Start your email here",
    autofocus,
  });

  // sending
  const handleSend = async () => {
    try {
      if (isLoading || isSavingDraft) return;

      const values = getValues();

      // Validate recipient field
      if (!values.to || values.to.length === 0) {
        // toast.error("Recipient is required");
        createToast("Error", "Recipient is required", "danger");
        return;
      }

      setIsLoading(true);
      setAiGeneratedMessage(null);

      console.log({
        to: values.to,
        cc: showCc ? values.cc : undefined,
        bcc: showBcc ? values.bcc : undefined,
        subject: values.subject,
        message: editor.getHTML(),
        attachments: values.attachments || [],
        fromEmail: values.fromEmail,
      });

      const messageId = await onSendEmail({
        to: values.to,
        cc: showCc ? values.cc : undefined,
        bcc: showBcc ? values.bcc : undefined,
        subject: values.subject,
        message: editor.getHTML(),
        attachments: values.attachments || [],
        fromEmail: values.fromEmail,
        draftId,
      });

      console.log(messageId);

      // push to threads if no threadId & sec === sent
      // append to mails if threadId exists

      // setHasUnsavedChanges(false);
      // editor.commands.clearContent(true);
      // form.reset();
      // setIsComposeOpen(null);
    } catch (error) {
      console.error("Error sending email:", error);
      createToast("Error", "Error Sending Email", "danger");
      // toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  // save draft
  const saveDraft = async () => {
    const values = getValues();

    if (!hasUnsavedChanges || !user) return;
    const messageText = editor.getText();

    if (messageText.trim() === initialMessage.trim()) return;
    if (editor.getHTML() === initialMessage.trim()) return;
    if (!values.to.length || !values.subject.length || !messageText.length)
      return;
    if (aiGeneratedMessage || aiIsLoading || isGeneratingSubject) return;

    try {
      setIsSavingDraft(true);

      const mail = {
        to: values.to,
        cc: showCc ? values.cc : undefined,
        bcc: showBcc ? values.bcc : undefined,
        subject: values.subject,
        message: editor.getHTML(),
        attachments: values.attachments || [],
        fromEmail: values.fromEmail,
        draftId,
      };
      const sendingUser: { email: string; name: string; image: any } = {
        email: user.email,
        name: user.name,
        image: user.image,
      };

      const res = await sendingMail(
        mail,
        sendingUser,
        null,
        "draft",
        replyToMessage,
        threadId,
      );

      // console.log(draftData)
      // const response = await createDraft(draftData);

      if (res) setDraftId(res);
      // if (response?.id && response.id !== draftId) {
      //   setDraftId(response.id);
      // }
    } catch (error) {
      console.error("Error saving draft:", error);
      createToast("Error", "Failed to save draft", "danger");
      setIsSavingDraft(false);
      setHasUnsavedChanges(false);
    } finally {
      setIsSavingDraft(false);
      setHasUnsavedChanges(false);
    }
  };

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      saveDraft();
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges]);

  return (
    <div
      className={cn(
        "no-scrollbar max-h-[500px] w-full max-w-[750px] overflow-hidden rounded-2xl bg-[#FAFAFA] p-0 py-0 shadow-sm dark:bg-[#202020]",
        className,
      )}
    >
      <div className="no-scrollbar dark:bg-panelDark max-h-[500px] grow overflow-y-auto">
        <ToItems
          isAddingRecipients={isAddingRecipients}
          toEmails={toEmails}
          showCc={showCc}
          showBcc={showBcc}
          ccEmails={ccEmails}
          bccEmails={bccEmails}
          isAddingCcRecipients={isAddingCcRecipients}
          isAddingBccRecipients={isAddingBccRecipients}
          setValue={setValue}
          setIsAddingBccRecipients={setIsAddingBccRecipients}
          setIsAddingCcRecipients={setIsAddingCcRecipients}
          setIsAddingRecipients={setIsAddingRecipients}
          setShowCc={setShowCc}
          setShowBcc={setShowBcc}
          setHasUnsavedChanges={setHasUnsavedChanges}
          toWrapperRef={toWrapperRef}
          toInputRef={toInputRef}
          ccInputRef={ccInputRef}
          ccWrapperRef={ccWrapperRef}
          bccInputRef={bccInputRef}
          bccWrapperRef={bccWrapperRef}
          onClose={onClose}
        />
        <Subject
          subjectInput={subjectInput}
          setHasUnsavedChanges={setHasUnsavedChanges}
          setValue={setValue}
          isLoading={isLoading}
          isGeneratingSubject={isGeneratingSubject}
          handleGenerateSubject={() =>
            handleGenerateSubject(setIsGeneratingSubject)
          }
        />
        <EmailContent
          editorClassName={editorClassName}
          aiGeneratedMessage={aiGeneratedMessage}
          editor={editor}
        />
      </div>
      <BottomActions
        handleSend={handleSend}
        isLoading={isLoading}
        aiIsLoading={aiIsLoading}
        subjectInput={subjectInput}
        settingsLoading={settingsLoading}
        fileInputRef={fileInputRef}
        handleAttachment={handleAttachment}
        setValue={setValue}
        attachments={attachments}
        setHasUnsavedChanges={setHasUnsavedChanges}
        aiGeneratedMessage={aiGeneratedMessage}
        setAiGeneratedMessage={setAiGeneratedMessage}
        editor={editor}
        handleGenerateSubject={handleGenerateSubject}
        handleAiGenerate={() =>
          handleAiGenerate(setIsLoading, setAiIsLoading, getValues)
        }
      />
    </div>
  );
};

const handleGenerateSubject = async (
  setIsGeneratingSubject: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsGeneratingSubject(true);
  // const { subject } = await generateEmailSubject({ message: editor.getText() });
  // setValue('subject', subject);
  setTimeout(() => {
    setIsGeneratingSubject(false);
  }, 2000);
};

const handleAttachment = (
  files: File[],
  setValue: any,
  attachments: any,
  setHasUnsavedChanges: any,
) => {
  if (files && files.length > 0) {
    // handle checking file size here
    setValue("attachments", [...(attachments ?? []), ...files]);
    setHasUnsavedChanges(true);
  }
};

const handleAiGenerate = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAiIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  getValues: any,
) => {
  try {
    setIsLoading(true);
    setAiIsLoading(true);
    const values = getValues();

    // const result = await aiCompose({
    //   prompt: editor.getText(),
    //   emailSubject: values.subject,
    //   to: values.to,
    //   cc: values.cc,
    //   threadMessages: threadContent,
    // });

    // setAiGeneratedMessage(result.newBody);
    // toast.success('Email generated successfully');
  } catch (error) {
    console.error("Error generating AI email:", error);
    createToast("Error", "Error generating email", "danger");
    // toast.error("Failed to generate email");
  } finally {
    setIsLoading(false);
    setAiIsLoading(false);
  }
};
