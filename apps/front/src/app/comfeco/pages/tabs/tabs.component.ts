import { Component, ContentChildren, QueryList, AfterContentInit, AfterContentChecked } from "@angular/core";
import { TabItemComponent } from "./tab-item.component";
import { Observable } from "rxjs";
import { startWith, map, delay } from "rxjs/operators";
 
@Component({
  selector: "app-tabs",
  template: `
    <div class="tabs-header">
      <div
        *ngFor="let item of tabItems$ | async"
        class="tab-label"
        (click)="selectTab(item)"
        [class.active]="activeTab === item"
      >
        <ng-container *ngIf="!item.labelComponent">
          <i [ngClass]="item.icon"></i>
          <span [class.active]="activeTab === item">{{ item.label }}</span>
        </ng-container>
      </div>
    </div>
    <div class="tabs-body">
      <ng-container *ngIf="activeTab && activeTab.bodyComponent">
        <ng-container *ngTemplateOutlet="activeTab.bodyComponent.bodyContent">
        </ng-container>
      </ng-container>
    </div>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit, AfterContentChecked {
  @ContentChildren(TabItemComponent)
  tabs: QueryList<TabItemComponent>;

  tabItems$: Observable<TabItemComponent[]>;

  activeTab: TabItemComponent;

  ngAfterContentInit(): void {
    this.tabItems$ = this.tabs.changes
      .pipe(startWith(""))
      .pipe(delay(0))
      .pipe(map(() => this.tabs.toArray()));
  }

  ngAfterContentChecked() {
    if (!this.activeTab) {
      Promise.resolve().then(() => {
        this.activeTab = this.tabs.first;
      });
    }
  }

  selectTab(tabItem: TabItemComponent) {
    if (this.activeTab === tabItem) {
      return;
    }

    if (this.activeTab) {
      this.activeTab.isActive = false;
      
    }

    this.activeTab = tabItem;

    tabItem.isActive = true;
  }
}
