import { HeaderComponent } from './@components/header/header.component';
import { FooterComponent } from './@components/footer/footer.component';
import { LayoutComfecoComponent } from './layout/layout-comfeco.component';
import { PageContentComponent } from './@components/page-content/page-content.component';
import { MenuDesktopComponent } from './@components/menu/menu-desktop/menu-desktop.component';
import { MenuMobileComponent } from './@components/menu/menu-mobile/menu-mobile.component';

export const components = [
  /* Componentes de la plantilla */
  HeaderComponent,
  FooterComponent,
  PageContentComponent,
  MenuDesktopComponent,
  MenuMobileComponent,

  /* Estructura de la página de la plantilla a ver por el usuario */
  LayoutComfecoComponent,
];
