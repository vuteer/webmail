"use client"; 

import { useCustomEffect } from "@/hooks";
import { getWeekAppointments } from "@/lib/api-calls/appointments";
import { appointmentStateStore } from "@/stores/appointment";
import React from "react"; 


const FetchAppointments = ({week, year}: {week: number, year: number}) => {
    const [mounted, setMounted] = React.useState<boolean>(false); 

    const {addAppointments} = appointmentStateStore(); 

    React.useEffect(() => setMounted(true), []); 

    const fetchAppointments = async () => {
        if (!mounted) return; 
        let res = await getWeekAppointments(week, year); 

        if (res) {
            // console.log(res)
            addAppointments([]); 
            addAppointments(res.docs); 
        }
    }
    useCustomEffect(fetchAppointments, [mounted, week, year]); 

    return (
        <>
        
        </>
    )
};

export default FetchAppointments; 