import { Component, Input } from '@angular/core';

@Component({
    selector: 'user-detail',
    template: `
    <div>
        <label>
            UserID:
            <input [(ngModel)]="userDetails.userID" placeholder="00000" />
        </label>
        <br />
        <label>
            Auth token:
            <input [(ngModel)]="userDetails.authToken" placeholder="0123456789abcdef0123456789abcdef01234567" />
        </label>
    </div>`,
})
export class UserDetailComponent {
    @Input() userDetails: any;          // TOOD: Add type
}
