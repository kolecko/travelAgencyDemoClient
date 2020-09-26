import {Component, ElementRef, Inject, OnInit, ViewChild, EventEmitter, Input, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OffersComponent} from '../offers.component';
import {Moment} from 'moment';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {Reservation} from 'src/app/models/reservation.model';
import {DateRange} from 'src/app/models/daterange.model';
import {User} from 'src/app/models/user.model';
import {Payment} from 'src/app/models/payment.model';
import {MatStepper} from '@angular/material/stepper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription, timer} from 'rxjs';
import {switchMap, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  reservedDates: DateRange[];
  reservation: Reservation = new Reservation();

  calendarForm = true;
  calendarFormGroup: FormGroup;


  loginForm = false;
  loginFormGroup: FormGroup;


  reservationForm = false;
  reservationFormGroup: FormGroup;

  paymentForm = true;
  paymentFormGroup: FormGroup;

  availableRange: DateRange = {
    begin: moment(this.offer.valid_from).isAfter(moment()) ? moment(this.offer.valid_from) : moment(),
    end: moment(this.offer.valid_to)
  };

  selectedDate: Moment;
  // tslint:disable-next-line:variable-name
  private _selectedRange: DateRange = {
    begin: null,
    end: null
  };

  get selectedRange() {
    return this._selectedRange;
  }

  set selectedRange(value: DateRange) {
    this.calendarFormGroup.patchValue({
      date_from: value.begin,
      date_to: value.end
    });
    this._selectedRange = value;
  }

  user: User = new User();
  loginError = false;

  private counterSource$ = new Subject<any>();
  private subscription = Subscription.EMPTY;

  @Input() counter = 5200;
  @Input() interval = 1000;
  countdown: number;

  payment = new Payment();

  getDates() {
    this.http.get('/api/reservations/' + this.offer.id).subscribe(data => {
      const reservedDates = [];
      let orderDates: any;
      for (orderDates of (<any> data).ordersDates.orderDates) {
        const dateRange: DateRange = {
          begin: moment(orderDates.date_from),
          end: moment(orderDates.date_to)
        };
        reservedDates.push(dateRange);
      }

      this.reservedDates = reservedDates;
    });
  }

  isFreeFilter = (date: Moment) => {
    let dateRange: DateRange;
    for (dateRange of this.reservedDates) {
      if (date.isBetween(dateRange.begin, dateRange.end, undefined, '[]')) {
        return false;
      }
    }

    return true;
  };

  selectedDateChange($event) {
    this.selectedDate = $event;
  }

  selectedRangeChange($event) {
    this.selectedRange = $event;
  }

  pushCalendarForm() {
    this.reservation.date_from = this.selectedRange.begin.format('YYYY-MM-DD');
    this.reservation.date_to = this.selectedRange.end.format('YYYY-MM-DD');
    this.stepper.next();
  }

  runTimer() {
    this.subscription = this.counterSource$.pipe(
      switchMap(({interval, count}) =>
        timer(0, interval).pipe(
          take(count),
          tap(() => this.countdown == --count)
        )
      )
    ).subscribe();
  }

  formatMinutes(value: number) {
    return Math.floor(value / 60);
  }

  pushLoginForm() {
    this.user = this.loginFormGroup.value;
    this.http.post('/api/users/login', this.user).subscribe(res => {
      if ((<any> res).status) {
        this.user = (<any> res).customer;
        this.stepper.next();
      } else {
        this.loginError = true;
      }
    });
  }


  pushReservationForm() {
    this.reservation.customer_id = this.user.id;
    this.reservation.offer_id = this.offer.id;

    this.http.post('/api/reservations/', this.reservation).subscribe(res => {
      this.reservation.id = (<any> res).id;
      this.payment.reservation_id = this.reservation.id;
      this.calendarForm = false;
      this.stepper.next();
    });

    this.runTimer();
  }

  pushPaymentForm() {
    this.payment.customer_id = this.user.id;
    this.http.post('/api/reservations/pay', this.payment).subscribe(res => {
      this.payment.number = (<any> res).id;
      this.paymentForm = false;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OffersComponent>,
    @Inject(MAT_DIALOG_DATA) public offer: any
  ) {
    this.getDates();
  }

  ngOnInit() {
    this.calendarFormGroup = this.fb.group({
      date_from: [null, Validators.required],
      date_to: [null, Validators.required]
    });

    this.loginFormGroup = this.fb.group({
      team: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    });

    this.reservationFormGroup = this.fb.group({
      persons: [0, Validators.compose([Validators.min(1), Validators.max(this.offer.max_persons)])]
    });

    this.reservationFormGroup.get('persons').valueChanges.subscribe(value => {
      this.reservation.persons = value;
      this.reservation.price = value * this.offer.price * this.selectedRange.end.diff(this.selectedRange.begin, 'days');
    });

    this.paymentFormGroup = this.fb.group({
      card_holder: ['', Validators.required]
    });

    this.paymentFormGroup.get('card_holder').valueChanges.subscribe(value => {
      this.payment.card_holder = value;
    });
  }
}
