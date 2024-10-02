// appointment modal 
import React from "react";
import { AppointmentType, WithType } from "@/types";
import { Modal } from "./modal";
import Badge from "../utils/badge";
import AppInput from "../common/app-input";
import FormTitle from "../forms/components/form-title";
import CalendarPopover from "../popovers/calendar-popover";
import { Heading3, Heading4, Paragraph } from "../ui/typography";
import { Calendar, ChevronLeft, Clock, Plus, X } from "lucide-react";
import dayjs from "dayjs";
import AppCheckbox from "../common/app-checkbox";
import { Button } from "../ui/button";
import { createToast } from "@/utils/toast";
import { cancelAppointment, createAppointment, updateAppointment } from "@/lib/api-calls/appointments";
import { appointmentStateStore } from "@/stores/appointment";
import { Separator } from "../ui/separator";
import { validateEmail, validatePhone } from "@/utils/validation";

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    date?: Date;
    time?: string;
    appointment?: AppointmentType;
};

const AppointmentModal: React.FC<AppointmentModalProps> = (
    { isOpen, onClose, appointment, date, time }
) => {
    const { addAppointment, addAppointments,  appointments } = appointmentStateStore();

    const [cLoading, setCLoading] = React.useState<boolean>(false);
    const [dLoading, setDLoading] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>(appointment?.title || "");
    const [selectedTime, setSelectedTime] = React.useState<string>("");
    const [selectedDate, setSelectedDate] = React.useState<Date>()
    const [selectedWith, setSelectedWith] = React.useState<WithType[]>(appointment?.with || []);
    const [googleOrZoom, setGoogleOrZoom] = React.useState<"google" | "zoom" | undefined>();
    const [onlineURL, setOnlineURL] = React.useState<string>(appointment?.google_meet || appointment?.zoom_url || "");
    const [onlinePassword, setOnlinePassword] = React.useState<string>(appointment?.google_meet_password || appointment?.zoom_password || "");

    const [step, setStep] = React.useState<1 | 2>(1);

    React.useEffect(() => {
        if (date) setSelectedDate(date);
        if (time) setSelectedTime(time)
    }, [date, time]);

    React.useEffect(() => {
        if (!appointment) return;
        setSelectedDate(appointment?.date);
        setSelectedTime(appointment.time)
        setTitle(appointment.title);
        setGoogleOrZoom(appointment.zoom_url ? "zoom" : appointment.google_meet ? "google" : undefined);
        setOnlineURL(appointment.zoom_url || appointment.google_meet || "")
        setOnlinePassword(appointment.google_meet_password || appointment.zoom_password || "");
        setSelectedWith(appointment.with || [])

    }, [appointment]);

    const handleCreateOrEditAppointment = async () => {
        if (!title || !selectedDate || !selectedTime) {
            createToast("error", "Provide a date, time and title");
            return;
        };

        if (googleOrZoom) {
            if (!onlineURL || !onlinePassword) {
                createToast("error", "Disable online meeting feature if not URL or password provided!");
                return;
            }
        };

        if (selectedWith.length === 0) {
            createToast("error", "Provide at least one participant!");
            return;
        }

        let doc: any = {
            title, time: selectedTime,
            date: selectedDate,
            with: selectedWith,
        };

        if (googleOrZoom) {
            if (googleOrZoom === "google") {
                doc.google_meet = onlineURL;
                doc.google_meet_password = onlinePassword;
            } else {
                doc.zoom_url = onlineURL;
                doc.zoom_password = onlinePassword;
            }
        };

        // if editing 
        if (appointment) {
            let original: any = {
                title: appointment?.title, 
                date: appointment?.date, 
                with: appointment?.with, 
            };

            if (appointment.google_meet || appointment.zoom_url) {
                if (appointment.google_meet) {
                    original.google_meet = appointment.google_meet;
                    original.google_meet_password = appointment.google_meet_password;
                } else {
                    original.zoom_url = appointment.zoom_url;
                    original.zoom_password = appointment.zoom_password;
                }
            }

            if (JSON.stringify(original) === JSON.stringify(doc)) {
                createToast("error", "Nothing to update");
                return; 
            }

        }

        setCLoading(true);
        let res = appointment ?  await updateAppointment(appointment.id, doc): await createAppointment(doc);
        if (res) {
            createToast("success", 
                appointment ? "Appointment has been updated!": "Appointment has been created!");
            addAppointment({ id: appointment ? appointment.id: res, status: "active", ...doc });
            onClose()
        }
        setCLoading(false);
    }

    const handleCancelAppointment = async () => {
        if (!appointment) return;
        
        setDLoading(true); 

        let res = await cancelAppointment(appointment.id); 

        if (res) {
            createToast("success", `Appointment has been ${appointment.status === "active" ? "":"Un"}cancelled!`);
            let update: AppointmentType[] = [...appointments.filter(app => app.id !== appointment.id), {...appointment, status: appointment.status === "active" ? "cancelled": "active"}];
            addAppointments([]);
            addAppointments(update); 
            onClose()
        }
        setDLoading(false);
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Appointment overview"
            description="You can create or edit an appointment from here."
            height="h-fit"
        >
            {
                appointment && (
                    <div className="flex gap-2 items-center">
                        {
                            step === 2 && (
                                <Button
                                    className="my-2 rounded-full"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setStep(1)}
                                >
                                    <ChevronLeft size={19} />
                                </Button>
                            )
                        }

                        <Badge
                            type={appointment.status === "active" ? "primary" : "danger"}
                            text={appointment.status}
                        />
                    </div>
                )
            }
            {
                step === 1 ? (
                    <>
                        <AppInput
                            value={title}
                            setValue={setTitle}
                            label="Appointment subject"
                            disabled={cLoading || dLoading}
                        />
                        <FormTitle title="Day of appointment" />
                        <CalendarPopover
                            trigger={
                                <div className="px-1 py-2 rounded-lg flex w-full justify-between items-center cursor-pointer hover:bg-secondary">
                                    <Paragraph>{date ? dayjs(date).format("DD MMM, YYYY") : "Select date"}</Paragraph>
                                    <Calendar size={19} />
                                </div>
                            }
                            triggerClassName="w-full"
                            date={selectedDate}
                            setDate={setSelectedDate}
                        />
                        <FormTitle title="Actual time of event" />

                        <AppInput
                            value={selectedTime}
                            disabled={cLoading || dLoading}
                            setValue={setSelectedTime}
                            placeholder={"8:00AM"}
                            icon={<Clock size={18} />}
                            containerClassName="w-full"
                            cls="py-0 pb-1 px-1"
                        />

                        <FormTitle title="Online meeting?" />
                        <div className="flex flex-col gap-2">
                            {
                                googleOrZoom && (
                                    <AppCheckbox
                                        checked={typeof googleOrZoom === "string"}
                                        onCheck={() => setGoogleOrZoom(undefined)}
                                        text="Not an online meeting"
                                    />
                                )
                            }
                            <div className="flex gap-2 w-full">
                                <AppCheckbox
                                    checked={googleOrZoom === "google"}
                                    onCheck={() => setGoogleOrZoom("google")}
                                    text="Google meet"
                                />
                                <AppCheckbox
                                    checked={googleOrZoom === "zoom"}
                                    onCheck={() => setGoogleOrZoom("zoom")}
                                    text="Zoom meeting"
                                />
                            </div>
                            {
                                googleOrZoom && (
                                    <div className="w-full flex gap-2">
                                        <div className="flex-1">
                                            <AppInput
                                                disabled={cLoading || dLoading}
                                                value={onlineURL}
                                                setValue={setOnlineURL}
                                                label={`${capitalize(googleOrZoom)} URL`}
                                                placeholder={"Paste URL"}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <AppInput
                                                disabled={cLoading || dLoading}
                                                placeholder={"Paste password"}
                                                value={onlinePassword}
                                                setValue={setOnlinePassword}
                                                label={`${capitalize(googleOrZoom)} Password`}
                                            />
                                        </div>
                                    </div>
                                )
                            }

                            <Paragraph
                                className="cursor-pointer w-fit my-2 underline underline-offset-4 text-sm lg:text-md hover:text-main-color duration-700"
                                onClick={() => setStep(2)}
                            >{appointment ? "Edit/View": "Add"} participants</Paragraph>
                        </div>

                    </>
                ) : (
                    <>
                        
                        <WithComponent 
                            cLoading={cLoading}
                            dLoading={dLoading}
                            selectedWith={selectedWith}
                            setSelectedWith={setSelectedWith}
                        />
                    </>
                )
            }


            <div className="flex justify-end gap-2 my-3">
                <Button
                    className="min-w-[130px]"
                    disabled={cLoading || dLoading}
                    onClick={handleCreateOrEditAppointment}
                    variant={"outline"}
                >
                    {appointment ? "Updat" : "Creat"}{cLoading ? "ing..." : "e"}
                </Button>
                {
                    appointment && (
                        <Button
                            variant={appointment.status === "active" ? "destructive": "secondary"}
                            className="min-w-[130px]"
                            disabled={cLoading || dLoading}
                            onClick={handleCancelAppointment}
                        >
                            {appointment.status === "cancelled" ? "Unc": "C"}ancel{dLoading ? "ing..." : ""}
                        </Button>
                    )
                }
            </div>
        </Modal>
    )
};

export default AppointmentModal;


// supporting components

const WithComponent = (
    {selectedWith, setSelectedWith, cLoading, dLoading}:
    {
        selectedWith: WithType[]; 
        setSelectedWith: React.Dispatch<WithType[]>; 
        cLoading: boolean; 
        dLoading: boolean; 
    }
) => {
    const [tempName, setTempName] = React.useState<string>("");
    const [tempPhone, setTempPhone] = React.useState<string>("");
    const [tempEmail, setTempEmail] = React.useState<string>("");

    const handleAddingToWith = () => {
        if (!tempName) {
            createToast("error", "Provide participant's name");
            return; 
        };
        if (!tempPhone && !tempEmail) {
            createToast("error", "Provide an email or phone number!");
            return; 
        }
        if (tempPhone && !validatePhone(tempPhone)) {
            createToast("error", "Enter a valid phone number!");
            return; 
        }
        if (tempEmail && !validateEmail(tempEmail)) {
            createToast("error", "Enter a valid email!");
            return; 
        }

        let check = selectedWith.filter(wth => wth.phone === tempPhone || wth.email === tempEmail); 

        if (check.length > 0) {
            createToast("error", "Participant with a similar phone or email already exists!");
            return; 
        }

        setSelectedWith([...selectedWith, {phone: tempPhone, name: tempName, email: tempEmail}]); 
        setTempPhone("");
        setTempEmail("")
        setTempName(""); 
    }

    let containerClassName ="bg-transparent border-0 border-b-2 !border-gray-500 px-0 rounded-none";
    let cls = "text-xs lg:text-sm pl-0"
    return (
        <div className="w-full my-3">
            <Heading3 className="my-3 font-bold text-md lg:text-md">Participants ({selectedWith.length})</Heading3>
            <Separator className="my-2"/>
            <div className="h-[20vh] overflow-auto">
                {
                    selectedWith.map((wth: WithType, index: number) => (
                        <div className="flex items-end my-2 border-b-2 py-2" key={index}>
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <Paragraph className="text-sm lg:text-sm">{wth.name}</Paragraph>
                                <Paragraph className="text-sm lg:text-sm">{wth.email}</Paragraph>
                                <Paragraph className="text-sm lg:text-sm">{wth.phone}</Paragraph>
                            </div>
                            <span
                                className="text-sm hover:text-destructive duration-700 cursor-pointer"
                                onClick={() => setSelectedWith([...selectedWith.filter(wt => wt.email !== wth.email || wt.phone !== wth.phone)])}
                            >
                                <X size={18}/>
                            </span>
                        </div>
                             
                    ))
                }
                {
                    selectedWith.length === 0 && (
                        <div className="flex h-full w-full items-center justify-center">
                            <Heading4 className="text-md lg:text-md font-bold">Add participants below!</Heading4>
                        </div>
                    )
                }

            </div>
            <Separator className="my-2"/>
            <div className="flex gap-1 items-end">
                <div className="flex-1 grid grid-cols-3 gap-2">
                    <div>
                        <AppInput
                            label="Name"
                            value={tempName}
                            setValue={setTempName}
                            placeholder={"Kinyua Nyaga"}
                            disabled={cLoading || dLoading}
                            containerClassName={containerClassName}
                            cls={cls}
                        />
                    </div>
                    <div>
                        <AppInput
                            label="Email"
                            value={tempEmail}
                            setValue={setTempEmail}
                            placeholder={"user@domain.com"}
                            disabled={cLoading || dLoading}
                            containerClassName={containerClassName}
                            cls={cls}
                        />
                    </div>
                    <div>
                        <AppInput
                            label="Phone"
                            value={tempPhone}
                            setValue={setTempPhone}
                            placeholder={"254711 222 333"}
                            disabled={cLoading || dLoading}
                            containerClassName={containerClassName}
                            cls={cls}
                        />
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleAddingToWith}
                >
                    <Plus size={18}/>
                </Button>
            </div>
        </div>
    )
}



const capitalize = (value: string) => (
    `${value.charAt(0).toUpperCase()}${value.slice(1,)}`
)
