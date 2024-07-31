// security 
"use client";
import CheckboxItem from "./checkbox"
import Container from "./container"

const Security = () => {
    const handleClick = async () => {

    }
    return (
        <Container title="Security">
            <>
                <CheckboxItem 
                    checked={false}
                    text="Use 2 Factor Authentication"
                    onClick={handleClick}
                />
                <CheckboxItem 
                    checked={false}
                    text="Reset Password after every 30 days"
                    onClick={handleClick}
                />
            </>
        </Container>

    )
};

export default Security; 