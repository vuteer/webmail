

import AuthForm from "@/components/forms/auth";

import { Separator } from "@/components/ui/separator";
import { Heading1, Paragraph } from "@/components/ui/typography";

const Auth = ({params}: {params: {type: string}}) => {

    return (
        <section className="w-full h-full flex">
            <div className="flex flex-col items-center justify-center w-[50%] bg-[#020817] h-full max-md:hidden">
            {/* <Hero /> */}
            {/* <Heading variant="h1" title={"Get a professional mail!"} cls='text-white'/> */}
            {/* <Heading variant="h2" title={"Register now and start sending today!"} cls="my-2 text-white"/> */}
            {/* <a href="https://admin-mail.sokoetu.com" target="_blank" className="flex items-center gap-2 text-white text-sm hover:text-main">Register your domain here <ArrowRight size={18}/></a> */}
            </div>
            <Separator orientation="vertical" className="max-md:hidden" />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="max-w-[450px] w-full flex-1 flex justify-center flex-col gap-3">
                {/* <Heading variant="h1" title="Login" cls="text-center" /> */}
                <Heading1 className="capitalize text-md lg:text-xl text-center">{params.type}</Heading1>
                <Paragraph className="text-sm text-center">
                    You have to be registered by your domain admin to login
                </Paragraph>
                 
                <Separator />
                <AuthForm />
            </div>
            {/* <Footer /> */}
            </div>
      </section>
    )
};

export default Auth; 