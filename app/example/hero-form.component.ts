import { Component } from '@angular/core';
import { NgForm }    from '@angular/forms';
import { Hero }    from './hero';
@Component({
    selector: 'hero-form',
    template: `<div class="container">
    <div  [hidden]="submitted">
        <h1>Hero Form</h1>
    <form *ngIf="active" (ngSubmit)="onSubmit()" #heroForm="ngForm">
    <div class="form-group">
    <label for="name">Name</label>
<input type="text" class="form-control" required
    [(ngModel)]="model.name"
name="name"  #name="ngModel" >
    <div [hidden]="name.valid || name.pristine" class="alert alert-danger">
    Name is required
</div>
</div>
<div class="form-group">
    <label for="alterEgo">Alter Ego</label>
<input type="text" class="form-control"
    [(ngModel)]="model.alterEgo"
name="alterEgo" >
    </div>
    <div class="form-group">
    <label for="power">Hero Power</label>
<select class="form-control" required
    [(ngModel)]="model.power"
name="power" #power="ngModel" >
<option *ngFor="let p of powers" [value]="p">{{p}}</option>
</select>
<div [hidden]="power.valid || power.pristine" class="alert alert-danger">
    Power is required
</div>
</div>
<button type="submit" class="btn btn-default" [disabled]="!heroForm.form.valid">Submit</button>
<button type="button" class="btn btn-default" (click)="newHero()">New Hero</button>
</form>
</div>
<div [hidden]="!submitted">
    <h2>You submitted the following:</h2>
<div class="row">
    <div class="col-xs-3">Name</div>
    <div class="col-xs-9  pull-left">{{ model.name }}</div>
</div>
<div class="row">
    <div class="col-xs-3">Alter Ego</div>
<div class="col-xs-9 pull-left">{{ model.alterEgo }}</div>
</div>
<div class="row">
    <div class="col-xs-3">Power</div>
    <div class="col-xs-9 pull-left">{{ model.power }}</div>
</div>
<br>
    <button class="btn btn-default" (click)="submitted=false">Edit</button>
    </div>
    </div>`
})
export class HeroFormComponent {
    powers = ['Really Smart', 'Super Flexible',
        'Super Hot', 'Weather Changer'];
    model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
    submitted = false;
    onSubmit() { this.submitted = true; }
    // Reset the form with a new hero AND restore 'pristine' class state
    // by toggling 'active' flag which causes the form
    // to be removed/re-added in a tick via NgIf
    // TODO: Workaround until NgForm has a reset method (#6822)
    active = true;
    newHero() {
        this.model = new Hero(42, '', '');
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }
}