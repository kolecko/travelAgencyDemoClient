import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {OfferComponent} from './offer/offer.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  data: any = [];
  getOffers() {
    this.http.get('/api/offers').subscribe(data => {
      this.data = (<any> data).offers.offer.map(offer => {
        let image;
        if (offer.type === 'PRIATELSKY_POBYT') {
          image = './assets/placeholders/images/friends-spending-time-together-on-terrace-3851910.jpg';
        }

        if (offer.type === 'WELLNESS') {
          image = './assets/placeholders/images/loving-couple-hugging-each-other-while-relaxing-in-pool-3852454.jpg';
        }

        if (offer.type === 'HONEYMOON') {
          image = './assets/placeholders/images/sea-sunny-beach-sand-38302.jpg';
        }

        if (offer.type === 'SEA') {
          image = './assets/placeholders/images/photo-of-woman-sitting-on-boat-spreading-her-arms-1371360.jpg';
        }

        return {
          id: offer.id,
          title: offer.name,
          type: offer.type,
          img: image,
          price: offer.price,
          description: offer.description,
          max_persons: offer.max_persons,
          place: offer.place,
          valid_from: offer.due_from,
          valid_to: offer.due_to
        };
      });
    });

  }

  openDialog(offer: any) {
    this.dialog.open(OfferComponent, {
      width: '50%',
      data: offer
    });
  }

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.getOffers();
  }

  ngOnInit() {
  }
}
