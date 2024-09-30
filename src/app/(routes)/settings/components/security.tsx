// security 
"use client";
import CheckboxItem from "./checkbox"
import Container from "./container"
import {userPreferencesStore, SecurityType} from "@/stores/user-preferences"; 

const Security = () => {
    const { security, updateSecurity } = userPreferencesStore(); 

    const handleClick = async (val: keyof SecurityType) => {
        await updateSecurity(val)
    }
    return (
        <Container title="Security">
            <>
                <CheckboxItem 
                    checked={security.TwoFA}
                    text="Use Two Factor Authentication - 2FA"
                    onClick={() => handleClick("TwoFA")}
                />
                <CheckboxItem 
                    checked={security.reset}
                    text="Reset Password after every 30 days"
                    onClick={() => handleClick("reset")}
                />
            </>
        </Container>

    )
};

export default Security; 