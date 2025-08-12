import {
  CurvedArrow,
  MediumStack,
  ShortStack,
  LongStack,
  Smile,
  X,
  Sparkles,
} from "@/components/icons/icons";

import AppAvatar from "@/components/common/app-avatar";
import { createToast } from "@/utils/toast";
import { isValidEmail } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";

interface ToProps {
  isAddingRecipients: boolean;
  toEmails: any;
  showCc: boolean;
  showBcc: boolean;
  ccEmails: any;
  bccEmails: any;
  isAddingCcRecipients: boolean;
  isAddingBccRecipients: boolean;

  setValue: any;
  setIsAddingRecipients: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCc: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBcc: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddingCcRecipients: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddingBccRecipients: React.Dispatch<React.SetStateAction<boolean>>;

  toWrapperRef: React.RefObject<HTMLDivElement>;
  toInputRef: React.RefObject<HTMLInputElement>;
  ccInputRef: React.RefObject<HTMLInputElement>;
  ccWrapperRef: React.RefObject<HTMLDivElement>;
  bccInputRef: React.RefObject<HTMLInputElement>;
  bccWrapperRef: React.RefObject<HTMLDivElement>;

  onClose: any;
}

export const ToItems = ({
  isAddingRecipients,
  toEmails,
  showCc,
  showBcc,
  ccEmails,
  bccEmails,
  isAddingCcRecipients,
  isAddingBccRecipients,

  setValue,
  setIsAddingRecipients,
  setHasUnsavedChanges,
  setShowCc,
  setShowBcc,
  setIsAddingCcRecipients,
  setIsAddingBccRecipients,

  toWrapperRef,
  toInputRef,
  ccInputRef,
  ccWrapperRef,
  bccInputRef,
  bccWrapperRef,

  onClose,
}: ToProps) => {
  return (
    <>
      {/* To, Cc, Bcc */}
      <div className="shrink-0 overflow-y-auto border-b border-[#E7E7E7] pb-2 dark:border-[#252525]">
        <To
          toEmails={toEmails}
          isAddingRecipients={isAddingRecipients}
          toWrapperRef={toWrapperRef}
          toInputRef={toInputRef}
          setIsAddingRecipients={setIsAddingRecipients}
          setValue={setValue}
          setHasUnsavedChanges={setHasUnsavedChanges}
          setShowCc={setShowCc}
          setShowBcc={setShowBcc}
          showCc={showCc}
          showBcc={showBcc}
          onClose={onClose}
        />

        <div
          className={`flex flex-col gap-2 ${showCc || showBcc ? "pt-2" : ""}`}
        >
          {/* CC Section */}
          <CC
            isAddingCcRecipients={isAddingCcRecipients}
            ccWrapperRef={ccWrapperRef}
            ccInputRef={ccInputRef}
            setIsAddingCcRecipients={setIsAddingCcRecipients}
            setValue={setValue}
            setHasUnsavedChanges={setHasUnsavedChanges}
            showCc={showCc}
            ccEmails={ccEmails}
          />

          {/* BCC Section */}
          <BCC
            isAddingBccRecipients={isAddingBccRecipients}
            bccWrapperRef={bccWrapperRef}
            bccInputRef={bccInputRef}
            setIsAddingBccRecipients={setIsAddingBccRecipients}
            setValue={setValue}
            setHasUnsavedChanges={setHasUnsavedChanges}
            showBcc={showBcc}
            bccEmails={bccEmails}
          />
        </div>
      </div>
    </>
  );
};

const ToAvatar = ({ email }: { email: string }) => {
  const isMobile = useIsMobile();

  return (
    <span className="flex items-center gap-1 py-0.5 text-xs lg:text-sm text-black dark:text-white">
      <AppAvatar src="" name={email} />
      <span>{isMobile ? email.slice(0, 2) : email}</span>
    </span>
  );
};

// to component
const To = ({
  toEmails,
  isAddingRecipients,
  toWrapperRef,
  toInputRef,
  setIsAddingRecipients,
  setValue,
  setHasUnsavedChanges,
  setShowCc,
  setShowBcc,
  showCc,
  showBcc,
  onClose,
}: {
  toEmails: string[];
  isAddingRecipients: boolean;
  toWrapperRef: React.RefObject<HTMLDivElement>;
  toInputRef: React.RefObject<HTMLInputElement>;
  setIsAddingRecipients: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: any;
  setShowCc: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBcc: React.Dispatch<React.SetStateAction<boolean>>;
  showCc: boolean;
  showBcc: boolean;
  onClose: any;
}) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const emails = pastedText
      .split(/[,;\s]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    emails.forEach((email) => {
      if (isValidEmail(email)) {
        const emailLower = email.toLowerCase();
        if (!toEmails.some((e) => e.toLowerCase() === emailLower)) {
          validEmails.push(email);
        }
      } else {
        invalidEmails.push(email);
      }
    });

    if (validEmails.length > 0) {
      setValue("to", [...toEmails, ...validEmails]);
      setHasUnsavedChanges(true);
      if (validEmails.length === 1) {
        createToast("Success", "Email address added", "success");
      } else {
        createToast(
          "Success",
          `${validEmails.length} email addresses added`,
          "success",
        );
      }
    }

    if (invalidEmails.length > 0) {
      createToast(
        "Error",
        `Invalid email ${invalidEmails.length === 1 ? "address" : "addresses"}: ${invalidEmails.join(", ")}`,
        "danger",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (toEmails.includes(e.currentTarget.value.trim())) {
          createToast(
            "Warninng",
            "This email is already in the list",
            "warning",
          );
          // toast.error("This email is already in the list");
        } else {
          setValue("to", [...toEmails, e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (
      (e.key === " " && e.currentTarget.value.trim()) ||
      (e.key === "Tab" && e.currentTarget.value.trim())
    ) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (toEmails.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("to", [...toEmails, e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      toEmails.length > 0
    ) {
      setValue("to", toEmails.slice(0, -1));
      setHasUnsavedChanges(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim()) {
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (toEmails.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("to", [...toEmails, e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    }
  };
  return (
    <div className="flex justify-between px-3 pt-3">
      <div
        onClick={() => {
          setIsAddingRecipients(true);
          setTimeout(() => {
            if (toInputRef.current) {
              toInputRef.current.focus();
            }
          }, 0);
        }}
        className="flex w-full items-center gap-2"
      >
        <p className="text-xs lg:text-sm font-medium text-[#8C8C8C]">To:</p>
        {isAddingRecipients || toEmails.length === 0 ? (
          <div ref={toWrapperRef} className="flex flex-wrap items-center gap-2">
            {toEmails.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-full border px-1 py-0.5 pr-2"
              >
                <ToAvatar email={email} />

                <button
                  onClick={() => {
                    setValue(
                      "to",
                      toEmails.filter((_, i) => i !== index),
                    );
                    setHasUnsavedChanges(true);
                  }}
                  className="text-white/50 hover:text-white/90"
                >
                  <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                </button>
              </div>
            ))}
            <input
              ref={toInputRef}
              className="h-6 flex-1 bg-transparent text-sm font-normal leading-normal text-black placeholder:text-[#797979] focus:outline-none dark:text-white"
              placeholder="Enter email"
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsAddingRecipients(true);
              }}
              onBlur={handleBlur}
            />
          </div>
        ) : (
          <div className="flex min-h-6 flex-1 cursor-pointer items-center  text-xs lg:text-sm text-black dark:text-white">
            {toEmails.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {toEmails.slice(0, 3).map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full border px-1 py-0.5 pr-2"
                  >
                    <ToAvatar email={email} />

                    <button
                      onClick={() => {
                        setValue(
                          "to",
                          toEmails.filter((_, i) => i !== index),
                        );
                        setHasUnsavedChanges(true);
                      }}
                      className="text-white/50 hover:text-white/90"
                    >
                      <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                    </button>
                  </div>
                ))}
                {toEmails.length > 3 && (
                  <span className="ml-1 text-center text-[#8C8C8C]">
                    +{toEmails.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          tabIndex={-1}
          className="flex h-full items-center gap-2 text-xs lg:text-sm font-medium text-[#8C8C8C] hover:text-[#A8A8A8]"
          onClick={() => setShowCc(!showCc)}
        >
          <span>Cc</span>
        </button>
        <button
          tabIndex={-1}
          className="flex h-full items-center gap-2 text-xs lg:text-sm font-medium text-[#8C8C8C] hover:text-[#A8A8A8]"
          onClick={() => setShowBcc(!showBcc)}
        >
          <span>Bcc</span>
        </button>
        {onClose && (
          <button
            tabIndex={-1}
            className="flex h-full items-center gap-2 text-sm font-medium text-[#8C8C8C] hover:text-[#A8A8A8]"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5 fill-[#9A9A9A]" />
          </button>
        )}
      </div>
    </div>
  );
};

const CC = ({
  setIsAddingCcRecipients,
  isAddingCcRecipients,
  ccEmails,
  ccWrapperRef,
  setValue,
  setHasUnsavedChanges,
  ccInputRef,
  showCc,
}: {
  setIsAddingCcRecipients: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingCcRecipients: boolean;
  ccEmails: string[];
  ccWrapperRef: React.RefObject<HTMLDivElement>;
  setValue: any;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  ccInputRef: React.RefObject<HTMLInputElement>;
  showCc: boolean;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (ccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("cc", [...(ccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (e.key === " " && e.currentTarget.value.trim()) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (ccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("cc", [...(ccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      ccEmails?.length
    ) {
      setValue("cc", ccEmails.slice(0, -1));
      setHasUnsavedChanges(true);
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim()) {
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (ccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("cc", [...(ccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    }
  };
  return (
    <>
      {showCc && (
        <div
          onClick={() => {
            setIsAddingCcRecipients(true);
            setTimeout(() => {
              if (ccInputRef.current) {
                ccInputRef.current.focus();
              }
            }, 0);
          }}
          className="flex items-center gap-2 px-3"
        >
          <p className="text-sm font-medium text-[#8C8C8C]">Cc:</p>
          {isAddingCcRecipients || (ccEmails && ccEmails.length === 0) ? (
            <div
              ref={ccWrapperRef}
              className="flex flex-1 flex-wrap items-center gap-2"
            >
              {ccEmails?.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-full border px-2 py-0.5"
                >
                  <ToAvatar email={email} />

                  <button
                    onClick={() => {
                      setValue(
                        "cc",
                        ccEmails.filter((_, i) => i !== index),
                      );
                      setHasUnsavedChanges(true);
                    }}
                    className="text-white/50 hover:text-white/90"
                  >
                    <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                  </button>
                </div>
              ))}
              <input
                ref={ccInputRef}
                className="h-6 flex-1 bg-transparent text-sm font-normal leading-normal text-black placeholder:text-[#797979] focus:outline-none dark:text-white"
                placeholder="Enter email"
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsAddingCcRecipients(true);
                }}
                onBlur={handleBlur}
              />
            </div>
          ) : (
            <div className="flex min-h-6 flex-1 cursor-pointer items-center text-sm text-black dark:text-white">
              {ccEmails && ccEmails.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {ccEmails.slice(0, 3).map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded-full border px-1 py-0.5 pr-2"
                    >
                      <ToAvatar email={email} />

                      <button
                        onClick={() => {
                          setValue(
                            "cc",
                            ccEmails.filter((_, i) => i !== index),
                          );
                          setHasUnsavedChanges(true);
                        }}
                        className="text-white/50 hover:text-white/90"
                      >
                        <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                      </button>
                    </div>
                  ))}
                  {ccEmails.length > 3 && (
                    <span className="ml-1 text-center text-[#8C8C8C]">
                      +{ccEmails.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const BCC = ({
  setIsAddingBccRecipients,
  isAddingBccRecipients,
  bccEmails,
  bccWrapperRef,
  setValue,
  setHasUnsavedChanges,
  bccInputRef,
  showBcc,
}: {
  setIsAddingBccRecipients: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingBccRecipients: boolean;
  bccEmails: string[];
  bccWrapperRef: React.RefObject<HTMLDivElement>;
  setValue: any;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  bccInputRef: React.RefObject<HTMLInputElement>;
  showBcc: boolean;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (bccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("bcc", [...(bccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (e.key === " " && e.currentTarget.value.trim()) {
      e.preventDefault();
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (bccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("bcc", [...(bccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    } else if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      bccEmails?.length
    ) {
      setValue("bcc", bccEmails.slice(0, -1));
      setHasUnsavedChanges(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim()) {
      if (isValidEmail(e.currentTarget.value.trim())) {
        if (bccEmails?.includes(e.currentTarget.value.trim())) {
          createToast("Error", "This email is already in the list", "danger");
          // toast.error("This email is already in the list");
        } else {
          setValue("bcc", [...(bccEmails || []), e.currentTarget.value.trim()]);
          e.currentTarget.value = "";
          setHasUnsavedChanges(true);
        }
      } else {
        createToast("Error", "Please enter a valid email address", "danger");
        // toast.error("Please enter a valid email address");
      }
    }
  };
  return (
    <>
      {showBcc && (
        <div
          onClick={() => {
            setIsAddingBccRecipients(true);
            setTimeout(() => {
              if (bccInputRef.current) {
                bccInputRef.current.focus();
              }
            }, 0);
          }}
          className="flex items-center gap-2 px-3"
        >
          <p className="text-sm font-medium text-[#8C8C8C]">Bcc:</p>
          {isAddingBccRecipients || (bccEmails && bccEmails.length === 0) ? (
            <div
              ref={bccWrapperRef}
              className="flex flex-1 flex-wrap items-center gap-2"
            >
              {bccEmails?.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-full border px-2 py-0.5"
                >
                  <ToAvatar email={email} />

                  <button
                    onClick={() => {
                      setValue(
                        "bcc",
                        bccEmails.filter((_, i) => i !== index),
                      );
                      setHasUnsavedChanges(true);
                    }}
                    className="text-white/50 hover:text-white/90"
                  >
                    <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                  </button>
                </div>
              ))}
              <input
                ref={bccInputRef}
                className="h-6 flex-1 bg-transparent text-sm font-normal leading-normal text-black placeholder:text-[#797979] focus:outline-none dark:text-white"
                placeholder="Enter email"
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsAddingBccRecipients(true);
                }}
                onBlur={handleBlur}
              />
            </div>
          ) : (
            <div className="flex min-h-6 flex-1 cursor-pointer items-center text-sm text-black dark:text-white">
              {bccEmails && bccEmails.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {bccEmails.slice(0, 3).map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded-full border px-1 py-0.5 pr-2"
                    >
                      <ToAvatar email={email} />
                      <button
                        onClick={() => {
                          setValue(
                            "bcc",
                            bccEmails.filter((_, i) => i !== index),
                          );
                          setHasUnsavedChanges(true);
                        }}
                        className="text-white/50 hover:text-white/90"
                      >
                        <X className="mt-0.5 h-3.5 w-3.5 fill-black dark:fill-[#9A9A9A]" />
                      </button>
                    </div>
                  ))}
                  {bccEmails.length > 3 && (
                    <span className="ml-1 text-center text-[#8C8C8C]">
                      +{bccEmails.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
