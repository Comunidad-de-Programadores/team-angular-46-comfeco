import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { ComboInterface } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-article-container',
  templateUrl: './article-container.component.html',
  styleUrls: ['./article-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleContainerComponent {

  @Input() title:string;
  @Input() viewMore:string;
  @Input() comboBox = false;
  @Input() comboData:ComboInterface[] = [];
  @Input() comboTitleDefault:string;
  @Output() onComboOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  showWorkshop:boolean;

  toggleWorkshop() {
    this.showWorkshop = !this.showWorkshop;
  }

  onOptionSelected(event) {
    this.onComboOptionSelected.emit( event );
  }

}
