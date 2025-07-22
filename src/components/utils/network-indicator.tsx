"use client"
import * as React from 'react';
import useNetworkStatus from "@/hooks/useNetwork";

import {createToast} from "@/utils/toast";
import { useSession } from '@/lib/auth-client';
// import { useAuthUser, useSignOut } from "@/auth/authHooks";

const NetworkStatusIndicator = () => {
    const isOnline = useNetworkStatus();
    const firstUpdate = React.useRef(true);
    // const auth = useAuthUser();
    const { data: session } = useSession();
    const user = session?.user;


    React.useLayoutEffect(() => {
        if (firstUpdate.current || !user) {
            firstUpdate.current = false;
            return;
        }
        if (!isOnline) createToast("Error", 'You are currently offline', "danger");
    }, [isOnline]);

    return null;
};

export default NetworkStatusIndicator;
