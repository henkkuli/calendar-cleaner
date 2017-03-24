
export interface Filter {
    type: 'filter';
    matcher: Matcher;
}
export interface Rewriter {
    type: 'rewriter';
    matcher?: Matcher;
    find: string;
    replace: string;
}
export type Matcher = OrMatcher | AndMatcher | RegexMatcher;
export interface OrMatcher {
    type: 'or';
    conditions: Matcher[];
}
export interface AndMatcher {
    type: 'and';
    conditions: Matcher[];
}
export interface RegexMatcher {
    type: 'regex';
    regex: string;
}

export function execRules(summary: string, rules: (Filter | Rewriter)[]): string | undefined {
    let workSummary: string | undefined = summary;
    for (let rule of rules) {
        const [newSummary, cont]: [string | undefined, boolean] = execRule(workSummary, rule);

        workSummary = newSummary;

        if (!cont || workSummary === undefined)
            break;
    }

    return workSummary;
}

function execRule(summary: string, rule: Filter | Rewriter): [string | undefined, boolean] {
    switch (rule.type) {
        case 'filter':
            return execFilter(summary, rule);
        case 'rewriter':
            return execRewriter(summary, rule);
        default:
            throw new Error(`Invalid rule: ${JSON.stringify(rule)}`);
    }
}


function execFilter(summary: string, filter: Filter): [string | undefined, boolean] {
    if (filter.type !== 'filter' || !filter.matcher)
        throw new Error(`Invalid filter: ${JSON.stringify(filter)}`);

    if (execMatcher(summary, filter.matcher))
        return [undefined, false];
    return [summary, true];
}

function execRewriter(summary: string, rewriter: Rewriter): [string | undefined, boolean] {
    if (rewriter.type !== 'rewriter' || !rewriter.find || !rewriter.replace)
        throw new Error(`Invalid filter: ${JSON.stringify(rewriter)}`);

    if (rewriter.matcher && !execMatcher(summary, rewriter.matcher))
        return [summary, true];

    const find = new RegExp(rewriter.find);
    const replace = rewriter.replace;

    return [summary.replace(find, replace), false];
}

function execMatcher(summary: string, matcher: Matcher): boolean {
    switch (matcher.type) {
        case 'or':
            if (!matcher.conditions)
                throw new Error(`Invalid matcher: ${JSON.stringify(matcher)}`);

            return matcher.conditions.some(condition => execMatcher(summary, condition));

        case 'and':
            if (!matcher.conditions)
                throw new Error(`Invalid matcher: ${JSON.stringify(matcher)}`);

            return matcher.conditions.every(condition => execMatcher(summary, condition));
        case 'regex':
            if (!matcher.regex)
                throw new Error(`Invalid matcher: ${JSON.stringify(matcher)}`);

            const regex = new RegExp(matcher.regex);

            return summary.match(regex) !== null;

        default:
            throw new Error(`Invalid matcher: ${JSON.stringify(matcher)}`);
    }
}
