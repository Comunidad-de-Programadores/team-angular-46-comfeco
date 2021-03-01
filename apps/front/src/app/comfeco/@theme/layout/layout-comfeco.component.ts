import { AfterViewInit, Component, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'comfeco-layout',
  templateUrl: './layout-comfeco.component.html',
  styleUrls: ['./layout-comfeco.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutComfecoComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#FAFAFF';
  }

}
