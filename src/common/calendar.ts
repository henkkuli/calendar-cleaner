/*
export class Calendar {
    public method: Method;
    public period: string;
    public version: string;
    public events: Event[];
}
export class Event {
    public class: Class;
    public description: string;
    public lastModified: Date;
    public dtStamp: Date;
    public dtStart: Date;
    public dtEnd: Date;
    public categories: string[];
}

export enum Method {
    publish
}
export enum Class {
    public
}

interface ContentLine {
    name: string;
    params: string[];
    value: string;
}

function parse(data: string): Calendar[] {
    // Unfold lines
    data = data.replace(/\r\n\s/, '');

    // Split lines
    const lines = data.split(/\r\n/);

    // Parse lines...
    const contentLines = lines.map(parseContentLine);

    const calendars: Calendar[] = [];
    while (contentLines.length > 0) {
        calendars.push(parseCalendar(contentLines));
    }

    return calendars;
}

function parseContentLine(line: string): ContentLine {
    const xname = `(?:X-(?:[A-Za-z0-9]{3,}-)?[A-Za-z0-9-]+)`;
    const ianatoken = `(?:?[A-Za-z0-9-]+)`;
    const name = `(?:${xname}|${ianatoken})`;
    const value = `(?:[ \t\x21-\xFF]*)`;

    const paramname = name;
    const paramtext = `(?:[ \t\x21\x23-\x2B\x2D-\x39\x3C-\xFF]*)`;
    const quotedstring = `(?:[ \t\x21\x23-\xFF]*)`;
    const paramvalue = `(:?${paramtext}|${quotedstring})`;
    const param = `(?:${paramname}=${paramvalue}(?:,${paramvalue})*)`;

    const contentline = `(${name}(${param}*):${value}`;
    const matcher = new RegExp(contentline);
    const parts = line.match(name);

    const contentName = parts[1];
    const contentParams = parts[2].split(`;`);
    const contentValue = parts[3];

    return {
        name: contentName,
        params: contentParams,
        value: contentValue,
    };
}

function parseCalendar(lines: ContentLine[]): Calendar {
    if (lines[0].name !== 'BEGIN' || lines[0].value !== 'VCALENDAR')
        throw new Error();
    lines.shift();



    return null;
}

function parseEvent(): Event {
    return null;
}
*/