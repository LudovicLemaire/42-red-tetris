import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
})
export class SecondComponent implements OnInit {
  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  options = this._formBuilder.group({
    color: this.colorControl,
    fontSize: this.fontSizeControl,
  });

  constructor(private _formBuilder: FormBuilder) {}

  getFontSize() {
    return Math.max(10, this.fontSizeControl.value || 0);
  }

  ngOnInit(): void {}
}
