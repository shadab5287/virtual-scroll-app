import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private data: any[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Item #${i + 1}`,
    description: `This is the description for item #${i + 1}`,
    price: (Math.random() * 100).toFixed(2), // Random price between 0 and 100
    rating: (Math.random() * 5).toFixed(1), // Random rating between 0 and 5
    available: Math.random() > 0.5 // Random boolean to simulate availability
  }));

  getItems(start: number, count: number): Observable<any[]> {
    // Simulate network delay
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.data.slice(start, start + count));
        observer.complete();
      }, 500); // Simulate a 500ms network delay
    });
  }
}
