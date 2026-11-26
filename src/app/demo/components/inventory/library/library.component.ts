import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/demo/api/book';
import { BookService } from 'src/app/demo/service/inventory/book.service';

@Component({
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {

  books: Book[] = [];
  loading = true;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: books => {
        this.books = books;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
