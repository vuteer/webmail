"use client"
import * as React from 'react';
import useNetworkStatus from "@/hooks/useNetwork"; 

import {createToast} from "@/utils/toast"; 
import { useAuthUser, useSignOut } from "@/auth/authHooks";

const NetworkStatusIndicator = () => {
    const isOnline = useNetworkStatus();
    const firstUpdate = React.useRef(true);
    const auth = useAuthUser();

    let user = auth();


    React.useLayoutEffect(() => {
        if (firstUpdate.current || !user) {
            firstUpdate.current = false;
            return;
        }
        if (!isOnline) createToast("error", 'You are currently offline');
    }, [isOnline]);

    return null;
};

export default NetworkStatusIndicator; 