import { Component } from '@angular/core';

import { Filter, Rewriter, Matcher } from './filters';

@Component({
    selector: 'cal-app',
    template: `
    <div class="box">
        <div class="legend">User details:</div>
        <user-detail [userDetails]="userDetails"></user-detail>
    </div>
    <div class="box">
        <div class="legend">Rule set:</div>
        <rule-set [rules]="ruleSet"></rule-set>
    </div>
    <div class="box">
        <button (click)="generateUrl()">Generate URL</button>
    </div>`,
    styleUrls: [
        'base.css'
    ],
})
export class AppComponent {
    private userDetails = {
        userID: '',
        authToken: '',
    };
    private ruleSet: (Filter | Rewriter)[] = [];

    private generateUrl() {
        const url = `${window.location.href}api/${encodeURI(this.userDetails.userID)}/${encodeURI(this.userDetails.authToken)}/filter?rules=${encodeURI(JSON.stringify(this.ruleSet))}`;
        console.log(url);
    }
}
