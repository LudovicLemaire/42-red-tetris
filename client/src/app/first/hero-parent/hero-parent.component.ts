import { Component, OnInit } from '@angular/core';
import { HEROES } from '../../hero';

@Component({
  selector: 'app-hero-parent',
  templateUrl: './hero-parent.component.html',
  styleUrls: ['./hero-parent.component.scss'],
})
export class HeroParentComponent implements OnInit {
  heroes = HEROES;
  master = 'Parent';

  constructor() {}

  ngOnInit(): void {}
}
