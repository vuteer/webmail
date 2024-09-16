"use client"; 

import { useCustomEffect } from "@/hooks";
import { getWeekAppointments } from "@/lib/api-calls/appointments";
import { appointmentStateStore } from "@/stores/appointment";
import React from "react"; 


const FetchAppointments = ({week, year}: {week: number, year: number}) => {
    
    const {addAppointments} = appointmentStateStore(); 

    const fetchAppointments = async () => {
        let res = await getWeekAppointments(week, year); 

        if (res) {
            console.log(res)
            addAppointments(res.docs); 
        }
    }
    useCustomEffect(fetchAppointments, [week, year]); 

    return (
        <>
        
        </>
    )
};

export default FetchAppointments; 