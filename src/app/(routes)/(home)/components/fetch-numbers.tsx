import { useCustomEffect } from "@/hooks";
import { getNumbers } from "@/lib/api-calls/mails"
import { useMailNumbersStore } from "@/stores/mail-numbers";

const FetchNumbers = () => {
    const {inbox, setInitialNumbers} = useMailNumbersStore(); 

    const fetchNumbers = async () => {
        let res = await getNumbers(); 
        if (res) setInitialNumbers(res.inbox, res.junk, res.drafts);
    }

    useCustomEffect(fetchNumbers, [])
    return <></>
};

export default FetchNumbers; 