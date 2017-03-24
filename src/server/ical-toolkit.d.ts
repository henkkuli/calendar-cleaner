
interface IcalBuilder {
    spacers: boolean;
    NEWLINE_CHAR: string;
    throwError: boolean;
    ignoreTZIDMismatch: boolean;
    calname: string;
    timezone: string;
    tzid: string;
    method: 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';
    events: Event[];
    additionalTags?: { [asdf: string]: string };

    toString(): string | Error;
}

interface Event {
    start: Date;
    end: Date;
    transp: string;
    summary: string;

    alarms?: number[];
    additionalTags?: { [asdf: string]: string };
    uid?: string;
    sequence?: number;
    repeating?: {
        freq: 'SECONDLY' | 'MINUTELY' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        count: number;
        interval: number;
        until: Date;
    };
    allDay?: boolean;
    stamp?: Date;
    floating?: boolean;
    location?: string;
    description?: string;
    organizer?: {
        name: string;
        email: string;
        sendBy: string;
    };
    attendees?: {
        name: string;
        email: string;
        status?: "NEEDS-ACTION" | "ACCEPTED" | "DECLINED" | "TENTATIVE" | "DELEGATED";
        role?: "REQ-PARTICIPANT" | "OPT-PARTICIPANT" | "NON-PARTICIPANT";
        rsvp?: boolean;
    }[];
    method?: 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER';
    status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
    url?: string;
}

export interface IcalToolkit {
    createIcsFileBuilder(): IcalBuilder;
}