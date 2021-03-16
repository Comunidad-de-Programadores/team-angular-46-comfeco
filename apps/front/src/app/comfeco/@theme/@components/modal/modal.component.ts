import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { Modal } from './modal.interface';

@Component({
  selector: 'comfeco-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {

  @Input() open:boolean;
  @Input() modal:Modal;
  @Output() onConfirm: EventEmitter<Modal> = new EventEmitter();

  onCancelAction() {
    const newModal = {...this.modal, confirm:false};
    this.onConfirm.emit(newModal);
  }
  
  onConfirmAction() {
    const newModal = {...this.modal, confirm:true};
    this.onConfirm.emit(newModal);
  }
  
}
