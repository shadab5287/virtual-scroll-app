import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent implements OnInit {
  activeView = "table";
  
  @Input() items: string[] = [];           // Items received from the parent component
  @Input() loading = false;                // Loading state received from the parent component
  @Output() loadMore = new EventEmitter<void>(); // Event to notify parent to load more items
  
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
  private readonly thresholdBuffer = 30; // Load more when there are 20 items left
  private scrollEvents$ = new Subject<void>();
  
  ngOnInit() {
    // Handle scroll events with debounce to manage rapid scrolling
    this.scrollEvents$.pipe(debounceTime(150)).subscribe(() => {
      this.checkAndLoadMoreItems();
    });
  }

  activeViewToggle(type: string) {
    this.activeView = type;
  }

  onScroll() {
    this.scrollEvents$.next();
  }

  checkAndLoadMoreItems() {
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    // Calculate when to load more items
    if (!this.loading && end >= total - this.getDynamicThreshold()) {
      this.loadMore.emit(); // Notify the parent to load more items
    }
  }

  getDynamicThreshold(): number {
    // Adjust threshold for mobile devices
    const viewportHeight = this.viewport.elementRef.nativeElement.clientHeight;
    return viewportHeight < 600 ? this.thresholdBuffer / 2 : this.thresholdBuffer;
  }

  @HostListener('window:resize')
  onResize() {
    // Handle resizing - recalculate view range
    this.viewport.checkViewportSize();
  }
}
