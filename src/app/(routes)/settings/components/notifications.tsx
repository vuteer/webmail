// notifications 
"use client";
import CheckboxItem from "./checkbox"
import Container from "./container"
import {userPreferencesStore, NotificationType} from "@/stores/user-preferences"; 

const Notifications = () => {
    const { notifications, updateNotification } = userPreferencesStore(); 

    const handleClick = async (val: keyof NotificationType) => {
        await updateNotification(val)
    }
    return (
        <Container title="Notifications">
            <>
                <CheckboxItem 
                    checked={notifications.system}
                    text="Receive System Updates"
                    onClick={() => handleClick("system")}
                />
                <CheckboxItem 
                    checked={notifications.appointments}
                    text="Receive Appointment Notifications"
                    onClick={() => handleClick("appointments")}
                />
                <CheckboxItem 
                    checked={notifications.events}
                    text="Receive Event Reminders"
                    onClick={() => handleClick("events")}
                />
                <CheckboxItem 
                    checked={notifications.news}
                    text="Receive News Updates"
                    onClick={() => handleClick("news")}
                />
            </>
        </Container>

    )
};

export default Notifications; 