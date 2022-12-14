// Book Class: Represent a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.getElementById('container');
    const form = document.getElementById('book-form');
    console.log(container);
    console.log(form);
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  static displayBook() {
    const books = Store.getBooks();
    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  /**
   * Break task into add one single book
   * @param {*} book 
   */
  static addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete"></a></td>
    `; 
    list.appendChild(row);
  }

  static deleteBook(el) {
    console.log(el.classList);
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearField() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Store Class: Handle Stroage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static delBook(isbn) {
    let books = Store.getBooks();
    books = books.filter(book => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(books));
  }
}


// Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBook)


// Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (e) => {
  // Prevet
  e.preventDefault();

  // Get form value
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  
  // Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please enter all field', 'danger');
    return;
  }

  // Instantiate book
  const book = new Book(title, author, isbn);
  
  // console.log(book);
  UI.addBookToList(book);

  // Clear field
  UI.clearField();
  UI.showAlert(`${title} Added`, 'success');

  // Add book to store
  Store.addBook(book);
});

// Event: Remove a Book
document.getElementById('book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  UI.showAlert(`Book deleted`, 'success');
  console.log(e.target);

  Store.delBook(e.target.parentElement.previousElementSibling.textContent);
})
