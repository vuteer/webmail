import { useCustomEffect } from "@/hooks";
import { getNumbers } from "@/lib/api-calls/mails"
import { useMailNumbersStore } from "@/stores/mail-numbers";
import { useMailStoreState } from "@/stores/mail-store";

const FetchNumbers = () => {
    const {inbox, setInitialNumbers} = useMailNumbersStore(); 
    const {deletedMails} = useMailStoreState(); 

    const fetchNumbers = async () => {
        let res = await getNumbers(); 
        if (res) setInitialNumbers(res.inbox, res.junk, res.drafts);
    }

    useCustomEffect(fetchNumbers, [deletedMails.length])
    return <></>
};

export default FetchNumbers; 