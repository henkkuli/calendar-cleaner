import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserDetailComponent } from './userdetail.component';
import { RulesComponent, FilterRuleComponent, RewriterRuleComponent, MatcherRuleComponent } from './rules.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [
        AppComponent,
        UserDetailComponent,
        RulesComponent,
        FilterRuleComponent,
        RewriterRuleComponent,
        MatcherRuleComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
