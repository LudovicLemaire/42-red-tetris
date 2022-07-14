import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'red-tetris';
  mobileQuery: MediaQueryList;
  testNavList: { label: string; route: string; icon: string }[] = [
    { label: 'First component', route: 'first-component', icon: 'home' },
    { label: 'Second component', route: 'second-component', icon: 'settings' },
    { label: 'Third component', route: 'third-component', icon: 'book' },
    {
      label: 'Game component',
      route: 'game-component',
      icon: 'videogame_asset',
    },
  ];
  menu = false;
  weshalors = 'green';

  toggleTheme = new FormControl(
    !(
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  );

  @HostBinding('class') className = '';

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private overlay: OverlayContainer
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', _ => {
      this._mobileQueryListener;
    });
  }

  triggerMenu(): void {
    this.menu = !this.menu;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', _ => {
      this._mobileQueryListener;
    });
  }

  ngOnInit(): void {
    const windowsLightModeActive =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    this.changeTheme(windowsLightModeActive);

    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', e => {
      this.toggleTheme.setValue(e.matches);
    });

    this.toggleTheme.valueChanges.subscribe(lightMode => {
      this.changeTheme(lightMode);
    });
  }

  changeTheme(lightMode: boolean): void {
    const lightModeClassName = 'light-theme';
    this.className = lightMode ? lightModeClassName : '';
    if (lightMode) {
      this.overlay.getContainerElement().classList.add(lightModeClassName);
    } else {
      this.overlay.getContainerElement().classList.remove(lightModeClassName);
    }
  }
}
