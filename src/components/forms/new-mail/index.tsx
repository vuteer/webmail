"use client";

import React from "react";
import {  useRouter } from "next/navigation";
import {X} from "lucide-react"; 

import { v4 as uuidv4 } from 'uuid';

import {AppAvatar} from "@/components"; 
import {Button} from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Heading4, Paragraph } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import EditorContainer from "@/components/editor";
import ImageUploadModal from "@/components/modals/image-upload";
// import AIModal from "@/components/modals/ai-modal";

import { createToast } from "@/utils/toast";
import { validateEmail } from "@/utils/validation";
import { useSearch } from "@/hooks";
import { ReplyButtons,  }  from '@/app/(routes)/(home)/components/reply';
import {generateHTMLStr, removeHtmlTags} from "@/utils/html-string"; 
import { sendMail } from "@/lib/api-calls/mails";
import { searchContact } from "@/lib/api-calls/contacts";

import { createArray } from "@/utils/format-numbers";

import {cn} from "@/lib/utils"; 

const NewMailForm = () => {
  const { push } = useRouter();
  const searchParams = useSearch();
  const toFilled = searchParams?.get("to"); 

  const [to, setTo] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  const [emails, setEmails] = React.useState<string[]>([]);
  const [suggestions, setSuggestions] = React.useState<{avatar: string, email: string, name: string}[]>([]);
  const [openSuggestions, setOpenSuggestions] = React.useState<boolean>(false); 
  const [suggestionsLoading, setSuggestionsLoading] = React.useState<boolean>(false); 

  const [errors, setErrors] = React.useState<string[]>([]);

  const [clearEditor, setClearEditor] = React.useState<boolean>(false); 

  const [openFileUpload, setOpenFileUpload] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (toFilled && validateEmail(toFilled)) setEmails([toFilled])
  }, [toFilled])

  const validate = (draft?: boolean) => {
    if ((!to || !validateEmail(to)) && emails.length === 0) {
      createToast("error", "Mail has no recipient or is invalid!");
      setErrors([...errors, "to"]);
      setTimeout(() => { setErrors([]) }, 2500)
      return;
    };

    if (!subject) {
      createToast("error", "Mail has no subject!");
      setErrors([...errors, "subject"]);
      setTimeout(() => { setErrors([]) }, 2500)
      return;
    }

    if (!removeHtmlTags(message, false)) {
      createToast("error", "No message to send!");
      setErrors([...errors, "message"]);
      setTimeout(() => { setErrors([]) }, 2500)
      return;
    }

    let htmlStr = generateHTMLStr(subject, message);

    let threadItem = {
      messageId: uuidv4(),
      html: htmlStr,
      text: removeHtmlTags(message),
      from_me: true,
      subject,
      info: {
        sent: true, 
        draft: draft || false, 
        delivered: false, 
        read: true, 
        archived:  false,
        important:  false,
        starred: false, 
        flag:  false,
        forwarded:  false,
        trashed:  false,
        junk:  false
      },
      attachments: [], 
      createdAt: new Date(),
    };

    return threadItem; 
  }

  const handleSend = async (draft?: boolean) => {
    let threadItem = validate(draft);
    if (!threadItem) return; 
    setLoading(true); 
    let res = await sendMail({...threadItem, to: validateEmail(to) ? to: emails[0] }); 

    if (res) {
      createToast("success", draft ? "Mail saved to drafts": "Mail was sent successfully!");
      push(draft ? `/?sec=draft&threadId=${res}`: `/?sec=inbox&threadId=${res}`)
      setClearEditor(true)
    }

    setLoading(false)

  }

 
  // handles predicting email to send to using search contact
  const handleMailPrediction = async (str: string) => {
    if (str.length > 1) {
      setSuggestionsLoading(true)
      setOpenSuggestions(true)
    } else {
      setSuggestionsLoading(false)
      setOpenSuggestions(false);
      return
    }

    let res = await searchContact(str); 

    if (res) {
      console.log(res)
      setSuggestions(res.docs); 
    }

    setSuggestionsLoading(false);
    
  };

  console.log("HANDLE CC IN INDEX - NEW MAIL FORM")

  const handleSelectEmail = (email: string) => {
    if (!emails.includes(email)) {
      setEmails([...emails, email]); 
    };
    setOpenSuggestions(false);
    setTo("");
  } 

  return (
    <TooltipProvider delayDuration={0}>
      <div className="p-4 flex flex-col gap-4 w-full">

        <ImageUploadModal
          files={files}
          setFiles={setFiles}
          isOpen={openFileUpload}
          onClose={() => setOpenFileUpload(false)}
        />
        <div className="relative">
          <InputPair
            value={to}
            setValue={setTo}
            placeholder="user@domain.com"
            label="To: "
            error={errors.includes("to")}
            onKeyDown={handleMailPrediction}
            prefixes={
              <>
                {
                  emails.length > 0 && (
                    <div className="ml-3 flex gap-2 items-center mb-1">
                      
                      {
                        emails.map((mail, index) => (
                          <Card key={index} className={"flex gap-2 items-center text-sm p-2 border-none bg-secondary"}>
                            <span>{mail}</span>
                            <span className="cursor-pointer hover:text-destructive text-xs" onClick={() => setEmails([...emails.filter(m => m !== mail)])}><X size={18}/></span>
                          </Card>
                        ))
                      }
                    </div>
                  )
                }
              </>
            }
          />

          <Card className={cn(openSuggestions ? `flex flex-col gap-2 h-[250px] `: "hidden h-0 overflow-hidden", "duration-700  p-3 w-[40%] absolute top-8 mt-3 left-0 z-[250]")}>
              <Button className="self-end" size={"sm"} variant={"ghost"} onClick={() => setOpenSuggestions(false)}>
                <X size={18}/>
              </Button>
              <div className="flex-1 overflow-auto">
                {
                  suggestionsLoading && createArray(6).map(itm => <Skeleton className="w-full h-[20px] rounded-full" key={itm}/>)
                }
                {
                  !suggestionsLoading && suggestions.length > 0 && (
                    <>
                      {
                        suggestions.map((contact: {avatar: string, email: string, name: string}, index) => (
                          <div 
                            key={index} 
                            className="w-full p-1 hover:bg-secondary rounded-lg duration-700 flex items-center gap-2 cursor-pointer hover:text-main-color"
                            onClick={() => handleSelectEmail(contact.email)}
                          >
                              <AppAvatar 
                                src={contact.avatar}
                                name={contact.name}
                                dimension="w-10 h-10"
                              />
                              <div>
                                <Paragraph 
                                  className={"w-full text-xs lg:text-xs text-gray-500 line-clamp-1"}  
                                >
                                    {contact.name}
                                </Paragraph>
                                <Paragraph 
                                  className={"w-full text-sm lg:text-sm font-bold line-clamp-1"}  
                                >
                                    {contact.email}
                                </Paragraph>

                              </div>
                          </div>
                        ))
                      }
                    </>
                  )
                }

              </div>
          </Card>

        </div>
        <InputPair
          value={subject}
          setValue={setSubject}
          placeholder="Invoice 4567"
          label="Subject: "
          error={errors.includes("subject")}

        />
         
        <Heading4 className="text-sm lg:text-md my-1">Message</Heading4>
        
        <Card>
          <EditorContainer
            setContent={setMessage}
            clear={clearEditor}
            setClear={setClearEditor}
          />
        
        </Card>

        <ReplyButtons
          setOpenFileUpload={setOpenFileUpload}
          handleSend={handleSend}
          loading={loading}
        />
      </div>
    </TooltipProvider>
  );
};

export default NewMailForm;

export const InputPair = (
  { label, value, placeholder, setValue, error, type, onKeyDown, prefixes }: 
  { 
    label?: string, 
    placeholder: string, 
    value: string, 
    setValue: React.Dispatch<string>, 
    error?: boolean, 
    type?: string,
    onKeyDown?: (str: string) => Promise<void>; 
    prefixes?: React.ReactNode; 
  }
) => {
  const [active, setActive] = React.useState<boolean>(false);
  return (
    <div className={`flex w-[100%] items-center border-b-[.08rem] ${active ? "border-b-main-color" : error ? "border-b-danger" : ""}`}>
      {
        label && (
          <Heading4 className="text-sm lg:text-md">{label}</Heading4>
        )
      }
      {prefixes && prefixes}
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        className={`${!label ? "pl-0": ""} border-none focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
        onFocus={() => { setActive(true) }}
        onBlur={() => { setActive(false) }}
        onKeyDown={onKeyDown ? (e: any) => onKeyDown(e.target.value): () => {}}
        type={type || "string"}
      />
    </div>
  )
}
