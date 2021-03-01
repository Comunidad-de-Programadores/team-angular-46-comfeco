import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ComboInterface } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboComponent implements OnInit {

  @Input() data:ComboInterface[];
  @Input() titleDefault:string;
  @Input() error:string;
  @Output() onOptionSelected: EventEmitter<string> = new EventEmitter();
  
  showOptions:boolean;
  optionSelected:string = '';

  constructor(private _domref: ElementRef) { }
  
  ngOnInit(): void {
    this.optionSelected = this.titleDefault;
  }

  onClickOutside(event) {
    if (!this._domref.nativeElement.contains(event.target)) {
      this.showOptions = false;
    }
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  selectOption(event) {
    const element = event.currentTarget;
    const childrens = element.children;
    const idOption = element.getAttribute('id');

    this.onOptionSelected.emit( idOption );

    this._deselectAll(element);

    for (let i=0; i<childrens.length; i++) {
      const element = childrens[i].children[0];

      if(i==0) {
        this.optionSelected = element.innerHTML;
        element.classList.remove('font-normal');
        element.classList.add('font-semibold');
      } else {
        element.classList.remove('invisible');
        element.classList.add('visible');
      }
    };

    this.toggleOptions();
  }

  private _deselectAll(element) {
    const parent = element.parentNode;
    const childrens = parent.childNodes;
    for (let i=0; i<childrens.length; i++) {
      if(childrens[i].children) {
        const elementOption = childrens[i].children[0];
        const elementIcon = childrens[i].children[1];
        
        const option = elementOption.children[0];
        const icon = elementIcon.children[0];

        if(option.classList.contains('font-semibold')) {
          option.classList.remove('font-semibold');
        }
        if(!option.classList.contains('font-normal')) {
          option.classList.add('font-normal');
        }
        
        if(icon.classList.contains('visible')) {
          icon.classList.remove('visible');
        }
        if(!icon.classList.contains('invisible')) {
          icon.classList.add('invisible');
        }
      }
    };
  }


}
