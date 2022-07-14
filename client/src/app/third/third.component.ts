import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss'],
})
export class ThirdComponent implements OnInit {
  rate1 = 4;
  rate2 = 2;

  onRating1 = (value: number) => {
    this.rate1 = value;
  };
  onRating2 = (value: number) => {
    this.rate2 = value;
  };

  form: FormGroup;
  rate3: FormControl;

  constructor(private fb: FormBuilder) {
    this.rate3 = this.fb.control(3);
    this.form = this.fb.group({
      rate3: this.rate3,
    });
  }

  ngOnInit(): void {}
}
