import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductAddEditComponent } from './product-add-edit.component';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatCardContent, MatCard,MatTableModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']

})
// export class ProductListComponent {
//   private productService = inject(ProductService);
//     products$!: Observable<Product[]>;
//   constructor(private router: Router) {}
//   ngOnInit() {
//     this.products$ = this.productService.getAll();
//   }
//   deleteProduct(id: number) {
//     this.productService.Delete(id).subscribe(() => {
//       this.products$ = this.productService.getAll();
//     });
//   }
//   navigateToAddProduct() {
//     this.router.navigate(['/products/add']);
//   }
//   navigateToEditProduct(id: number) {
//     this.router.navigate([`/products/edit/${id}`]);
//   }

// }
export class ProductListComponent {
  displayedColumns: string[] = ['id', 'name', 'description', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => this.dataSource.data = products,
      error: (err) => this.showError(err.message)
    });
  }
  
  openAddEditDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductAddEditComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProducts();
    });
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.delete(id).subscribe({
          next: () => {
            this.showSuccess('Product deleted successfully');
            this.loadProducts();
          },
          error: (err) => this.showError(err.message || 'Failed to delete product')
        });
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}