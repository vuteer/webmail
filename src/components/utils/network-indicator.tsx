"use client"
import * as React from 'react';
import useNetworkStatus from "@/hooks/useNetwork"; 

import {createToast} from "@/utils/toast"; 

const NetworkStatusIndicator = () => {
    const isOnline = useNetworkStatus();
    const firstUpdate = React.useRef(true);

    React.useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        isOnline
            ? createToast("success", 'You are back online!')
            : createToast("error", 'You are currently offline');
    }, [isOnline]);

    return null;
};

export default NetworkStatusIndicator; 