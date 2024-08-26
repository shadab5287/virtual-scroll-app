import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private data: string[] = Array.from({ length: 10000 }, (_, i) => `Item #${i+1}`);

  getItems(start: number, count: number): Observable<string[]> {
    // Simulate network delay
    console.log(start,count,"what")
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.data.slice(start, start + count));
        observer.complete();
      }, 500); // Simulate a 500ms network delay
    });
  }
}
