// notifications 
"use client";
import CheckboxItem from "./checkbox"
import Container from "./container"

const Notifications = () => {
    const handleClick = async () => {

    }
    return (
        <Container title="Email Notifications">
            <>
                <CheckboxItem 
                    checked={false}
                    text="Receive System Updates"
                    onClick={handleClick}
                />
                <CheckboxItem 
                    checked={false}
                    text="Receive Important Notifications"
                    onClick={handleClick}
                />
                <CheckboxItem 
                    checked={false}
                    text="Receive Event Reminders"
                    onClick={handleClick}
                />
                <CheckboxItem 
                    checked={false}
                    text="Receive News Updates"
                    onClick={handleClick}
                />
            </>
        </Container>

    )
};

export default Notifications; 