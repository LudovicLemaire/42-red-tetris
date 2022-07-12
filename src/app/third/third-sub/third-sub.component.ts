import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-third-sub',
  templateUrl: './third-sub.component.html',
  styleUrls: ['./third-sub.component.scss'],
})
export class ThirdSubComponent implements OnInit {
  rate1!: number;
  onRating1!: (rate: number) => void;

  constructor() {}

  ngOnInit(): void {}
}
