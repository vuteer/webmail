"use client";
import React from "react";
import { useRouter } from "next/navigation";

import SoundQueryModal from "@/components/modals/sound";

import { socket } from "@/services/socket";

import { removeCookie, setCookie } from "@/helpers/cookies";

import { getUser } from "@/lib/api-calls/user";

import { useMailNumbersStore } from "@/stores/mail-numbers";
import { userStateStore } from "@/stores/user-store";
import { useNotificationStateStore } from "@/stores/notification-store";
import { useAuthUser, useSignOut } from "@/auth/authHooks";
import { useCustomEffect } from "@/hooks/useEffect";
import useNetworkStatus from "@/hooks/useNetwork"; 
import { useMailStoreState } from "@/stores/mail-store";
import useMounted from "@/hooks/useMounted";

const SetupSocket = () => {
  const notificationSoundRef = React.useRef<HTMLAudioElement>(null);
  const playButtonRef = React.useRef<HTMLButtonElement>(null); 
  const network = useNetworkStatus(); 

  const [muted, setMuted] = React.useState<boolean>(true);
  const [soundModal, setSoundModal] = React.useState<boolean>(false); 
  const mounted = useMounted(); 

  const { push } = useRouter();

  const auth = useAuthUser();
  const signOut = useSignOut();
  let user = auth();
  
  // useCustomEffect(() => {setMounted(true)}, []); 

  const { setInitialNumbers, addToNumber } = useMailNumbersStore();
  const { updateFieldsInitially, socketConnected } = userStateStore();
  const { addNotificationToState } = useNotificationStateStore();
  const {addNewThread} = useMailStoreState(); 

  const getCurrentUser = async () => {
    if (!user || socketConnected || !mounted) return;

    let res = await getUser(false);

    if (!res) {
      signOut();
      removeCookie("_auth_state");
      console.clear();
      push("/auth/login");
    } else {
      let { id, name, avatar, email, phone } = res.user;

      setCookie(
        "_auth_state",
        JSON.stringify({ id, avatar, name, email, phone })
      );
      socket.initialize(user, addNotificationToState, playButtonRef, addToNumber, addNewThread);

      // setup states here
      // AI field to be set for later 
      let { ai, drafts, contact_mail, finalized_setup, inbox, junk } = res.state;
       
      setInitialNumbers(inbox, junk, drafts);
      updateFieldsInitially(ai, finalized_setup, contact_mail, false, avatar, true);
    }
    setSoundModal(true)
  };

  useCustomEffect(getCurrentUser, [user, network, mounted]);

  const handlePlay: () => void = () => {
    setMuted(false); 
    notificationSoundRef.current?.play(); 
    // setMuted(true);
  }
  
  if (!mounted) return <></>
  return (
    <>
      <SoundQueryModal 
        isOpen={soundModal}
        onClose={() => setSoundModal(false)}
        cRef={playButtonRef}
      />
      <div className="absolute bottom-0 hidden right-0 z-40">
        <audio
          // autoPlay={f}
          // className="absolute hidden bottom-0 right-0 z-0"
          ref={notificationSoundRef}
          src={"/notification-sound.mp3"}
          muted={muted}
          
        />
        <button 
          onClick={handlePlay}
          ref={playButtonRef}
        >click</button> 
      </div>

    </>
  );
};

export default SetupSocket;
