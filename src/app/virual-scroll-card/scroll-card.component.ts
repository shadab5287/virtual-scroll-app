import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MockDataService } from "../virtual-scroll/mock-data.service";


@Component({
    selector:'app-scroll-card',
    templateUrl:'scroll-card.component.html',
    styleUrls:['scroll-card.component.css']
})

export class ScrollCardComponent implements OnInit {
    activeView = "table"
    items: string[] = [];
    itemCount = 0;
    totalItems = 10000;
    private readonly batchSize = 100;
    private readonly thresholdBuffer = 70; // Load more when there are 70 items left
    loading = false;
    private scrollEvents$ = new Subject<void>();
  
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
    constructor(private mockDataService: MockDataService) {}
  
    ngOnInit() {
      this.loadMoreItems();
      
      // Handle scroll events with debounce to manage rapid scrolling
      this.scrollEvents$.pipe(debounceTime(150)).subscribe(() => {
        this.checkAndLoadMoreItems();
      });
    }

    activeViewToggle(type:string){
        this.activeView = type
    }
  
    onScroll() {
      this.scrollEvents$.next();
    }
  
    checkAndLoadMoreItems() {
      const end = this.viewport.getRenderedRange().end;
      const total = this.viewport.getDataLength();
  
      // Calculate when to load more items
      if (!this.loading && end >= total - this.getDynamicThreshold()) {
        this.loadMoreItems();
      }
    }
  
    getDynamicThreshold(): number {
      // Adjust threshold for mobile devices
      const viewportHeight = this.viewport.elementRef.nativeElement.clientHeight;
      return viewportHeight < 600 ? this.thresholdBuffer / 2 : this.thresholdBuffer;
    }
  
    loadMoreItems() {
      if (this.loading || this.itemCount >= this.totalItems) return;
  
      this.loading = true;
  
      // Simulate network delay
      // const networkDelay = Math.random() * 2000; // Random delay between 0 to 2 seconds
      setTimeout(() => {
        this.mockDataService.getItems(this.itemCount, this.batchSize).subscribe(data => {
          this.items = [...this.items, ...data];
          console.log(this.items)
          this.itemCount += data.length;
          this.loading = false;
        }, error => {
          this.loading = false;
          console.error('Failed to load items', error);
        });
      }, 500);
    }
  
    @HostListener('window:resize')
    onResize() {
      // Handle resizing - recalculate view range
      this.viewport.checkViewportSize();
    }


}