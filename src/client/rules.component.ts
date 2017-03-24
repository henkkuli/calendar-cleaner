import { Component, Input } from '@angular/core';

import { Filter, Rewriter, Matcher } from './filters';

@Component({
    selector: 'rule-set',
    template: `
    <div *ngFor="let rule of rules; let ruleIndex = index" [ngSwitch]="rule.type" class="box">
        <div class="legend">
            <select [(ngModel)]="rule.type">
                <option [ngValue]="'filter'">Filter</option>
                <option [ngValue]="'rewriter'">Rewriter</option>
            </select>
            <button (click)="rules.splice(ruleIndex,1)">Remove</button>
        </div>
        <filter-rule *ngSwitchCase="'filter'" [filter]="rule"></filter-rule>
        <rewriter-rule *ngSwitchCase="'rewriter'" [rewriter]="rule"></rewriter-rule>
    </div>
    <button (click)="addRule()">Add rule</button>`,
    styleUrls: [
        'base.css'
    ],
})
export class RulesComponent {
    @Input() rules: (Filter | Rewriter)[] = [
        {
            "type": "filter",
            "matcher": {
                "type": "or",
                "conditions": [
                    {
                        "type": "regex",
                        "regex": "asdf"
                    },
                    {
                        "type": "regex",
                        "regex": "PHYS-A0130"
                    }
                ]
            }
        },
        {
            "type": "rewriter",
            "matcher": {
                "type": "regex",
                "regex": "PHYS-A0130"
            },
            "find": "^(.*?) (.*?)/(.*?)/(.*?)(?:, (.*?), (.*))?/ (.*?) - (.*?), (.*?)$",
            "replace": "[$1] [$2] [$3] [$4] [$5] [$6] [$7] [$8] [$9]"
        }
    ];

    private addRule() {
        this.rules = this.rules || [];

        this.rules.push({ type: 'filter', matcher: { type: 'regex', regex: '' } });
    }
}

@Component({
    selector: 'filter-rule',
    template: `
    <div>
        Matcher:
        <matcher-rule [matcher]="filter.matcher"></matcher-rule>
    </div>`,
    styleUrls: [
        'base.css'
    ],
})
export class FilterRuleComponent {
    @Input() filter: Filter;
}
@Component({
    selector: 'rewriter-rule',
    template: `
    <div>
        Matcher:
        <div *ngIf="rewriter.matcher">
            <button (click)="rewriter.matcher=null">Remove matcher</button>
            <matcher-rule [matcher]="rewriter.matcher"></matcher-rule>
        </div>
        <div *ngIf="!rewriter.matcher">
            <button (click)="rewriter.matcher={type: 'regex'}">Add matcher</button>
        </div>

        <label>
            Find expression:
            <input [(ngModel)]="rewriter.find" />
        </label>
        <br />
        <label>
            Replace expression:
            <input [(ngModel)]="rewriter.replace" />
        </label>
    </div>`,
    styleUrls: [
        'base.css'
    ],
})
export class RewriterRuleComponent {
    @Input() rewriter: Rewriter;
}

@Component({
    selector: 'matcher-rule',
    template: `
    <div class="box">
        <div class="legend">
            Type:
            <select [(ngModel)]="matcher.type">
                <option [ngValue]="'or'">Or</option>
                <option [ngValue]="'and'">And</option>
                <option [ngValue]="'regex'">Regular Expression</option>
            </select>
            <button *ngIf="parent" (click)="parent.conditions.splice(parent.conditions.indexOf(matcher), 1)">
                Remove
            </button>
        </div>
        <div *ngIf="['or', 'and'].includes(matcher.type)">
            Conditions:
            <div *ngFor="let condition of matcher.conditions">
                <matcher-rule [matcher]="condition" [parent]="matcher"></matcher-rule>
            </div>
            <button (click)="addCondition()">Add condition</button>
        </div>
        <div *ngIf="matcher.type==='regex'">
            <label>
                Rule: 
                <input [(ngModel)]="matcher.regex" />
            </label>
        </div>
    </div>`,
    styleUrls: [
        'base.css'
    ],
})
export class MatcherRuleComponent {
    @Input() matcher: Matcher;
    @Input() parent: Matcher;

    private addCondition() {
        if (this.matcher.type !== 'or' && this.matcher.type !== 'and')
            return;

        this.matcher.conditions = this.matcher.conditions || [];

        this.matcher.conditions.push({ type: 'or', conditions: [] });
    }
}


