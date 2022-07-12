import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss'],
})
export class ThirdComponent implements OnInit {
  rate2 = 4;
  rate3 = 2;

  onRating2 = (value: number) => {
    this.rate2 = value;
  };
  onRating3 = (value: number) => {
    this.rate3 = value;
  };

  form: FormGroup;
  rate5: FormControl;

  constructor(private fb: FormBuilder) {
    this.rate5 = this.fb.control(3);
    this.form = this.fb.group({
      rate5: this.rate5,
    });
  }

  ngOnInit(): void {}
}
