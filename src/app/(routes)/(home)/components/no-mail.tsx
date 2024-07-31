
import React from "react";
import Image from "next/image";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { images } from "@/assets";
import { Heading4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


// no mail id
const NoMailId = () => {
    // const [openNewMailModal, setOpenNewMailModal] =
    //   React.useState<boolean>(false);
    const { push } = useRouter();
    const pathname = usePathname();

    return (
        <div className="h-full flex flex-col items-center justify-center gap-2">
            {/* <NewMail
          isOpen={openNewMailModal}
          onClose={() => setOpenNewMailModal(false)}
        /> */}
            <div className="relative w-[60%] h-[50vh] flex justify-center">
                <Image
                    alt="no mail"
                    src={images.no_mail.src}
                    fill
                    className="object-contain"
                />
            </div>
            <Heading4 className="text-sm lg:text-md">Select a thread to access its content or send a new mail.</Heading4>
            <Button
                variant={"outline"}
                className="flex gap-2 items-center"
                onClick={() => push(`/write`)}
            >
                <Plus size={18} /> New mail
            </Button>
        </div>
    );
};

export default NoMailId;