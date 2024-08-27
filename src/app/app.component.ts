import { Component, OnInit } from '@angular/core';
import { MockDataService } from './service/mock-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: string[] = [];
  itemCount = 0;
  totalItems = 10000;
  private readonly batchSize = 100;

  loading = false;
  activeView:string = 'table' 

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadMoreItems(); // Initial load
  }

  activeViewToggle(type:string){
    this.activeView = type;
  //  this.resetData()
  }

  resetData() {
    this.items = []; // Clear the items array
    this.itemCount = 0; // Reset item count
    this.loadMoreItems(); // Load items from the beginning
  }

  loadMoreItems() {
    if (this.loading || this.itemCount >= this.totalItems) return;

    this.loading = true;

    this.mockDataService.getItems(this.itemCount, this.batchSize).subscribe(data => {
      this.items = [...this.items, ...data];
      this.itemCount += data.length;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error('Failed to load items', error);
    });
  }

  onScrollEnd() {
    this.loadMoreItems(); // Load more data when child component emits scroll end
  }
}
