import React from "react";
import Image from "next/image";

import { images } from "@/assets";
import { Heading4 } from "@/components/ui/typography";
import { ComposeButton } from "../../components/side-menu";

// no mail id
const NoMailId = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <div className="relative w-[60%] h-[50vh] flex justify-center">
        <Image
          alt="no mail"
          src={images.no_mail.src}
          fill
          className="object-contain"
        />
      </div>
      <Heading4 className="text-sm lg:text-md">
        Select a thread to access its content or send a new mail.
      </Heading4>
      <div className="max-w-2xl mx-auto">
        <ComposeButton sidemenuOpen={true} />
      </div>
    </div>
  );
};

export default NoMailId;
