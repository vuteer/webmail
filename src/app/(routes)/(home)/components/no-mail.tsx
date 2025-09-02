import React from "react";
import Image from "next/image";

import { images } from "@/assets";
import { Heading4 } from "@/components/ui/typography";
import { ComposeButton } from "../../components/side-menu";

// no mail id
const NoMailId = ({ content }: { content?: boolean }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      {/*<div className="relative w-[250px] h-[250px] flex justify-center">
        <Image
          alt="no mail"
          src={images.no_mail}
          fill
          className="object-contain"
        />
      </div>*/}
      {/*<Heading4 className="text-sm lg:text-md">
        Select a thread to access its content or send a new mail.
      </Heading4>*/}
      {content && <NoThreadSelected />}
      <div className="max-w-2xl mx-auto">
        <ComposeButton sidemenuOpen={true} />
      </div>
    </div>
  );
};

export default NoMailId;

// import { Card, CardContent } from "@/components/ui/card"

function NoThreadSelected() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <>
        <h2 className="text-xl font-semibold mb-2">📭 No thread selected</h2>
        <p className="text-muted-foreground mb-4">
          Select a conversation to view your emails.
        </p>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>✨ Summarize long emails instantly</p>
          <p>🤖 Get smart AI-powered replies</p>
          <p>🔍 Search by meaning, not just keywords</p>
          <p>🚫 Advanced spam & intent detection</p>
          <p>📊 Prioritize what matters most</p>
          <p>📂 Store and access your important files</p>
          <p>📅 Manage your events and calendars seamlessly</p>
        </div>
      </>
    </div>
  );
}
