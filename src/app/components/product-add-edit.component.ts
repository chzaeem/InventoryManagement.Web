// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ProductService } from '../services/product.service';
// import { Product } from '../models/product.model';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-product-add-edit',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './product-add-edit.component.html'
// })
// export class ProductAddEditComponent {
//   private fb = inject(FormBuilder);
//   private productService = inject(ProductService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   isSubmitting = false;

//   form = this.fb.group({
//     name: ['', Validators.required],
//     description: [''],
//     quantity: [0, [Validators.required, Validators.min(0)]]
//   });

//   isEdit = false;
//   productId?: number;

//   constructor(private snackBar: MatSnackBar) {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.isEdit = true;
//       this.productId = +id;
//       this.productService.getById(this.productId).subscribe(product => {
//         this.form.patchValue({
//           name: product.Name || '',
//           description: product.Description || '',
//           quantity: product.Quantity || 0
//         });
//       });
//     }
//   }

//   onSubmit() {
//     if (this.form.invalid) return;

//     const productData = this.form.value;
//     this.isSubmitting = true;
//     if (this.isEdit && this.productId) {
//       const updatedProduct: Product = {
//         Id: this.productId,
//         Name: productData.name!,
//         Description: productData.description || '',
//         Quantity: productData.quantity!
//       };
//       this.productService.update(this.productId, updatedProduct).subscribe({
//         next: () => {
//           this.snackBar.open('Product updated successfully', 'Close', { 
//             duration: 3000,
//             panelClass: ['success-snackbar']
//           });
//           this.router.navigate(['/products']);
//         },
//         error: (err) => {
//           this.snackBar.open(err.message || 'Failed to update product', 'Dismiss', {
//             duration: 5000,
//             panelClass: ['error-snackbar']
//           });
//         }
//       });
//     } else {
//       const newProduct: Product = {
//         Id: 0, 
//         Name: productData.name!,
//         Description: productData.description || '',
//         Quantity: productData.quantity!
//       };
//       this.productService.create(newProduct).subscribe({
//         next: () => {
//           this.snackBar.open('Product created successfully!', 'Close', {
//             duration: 3000,
//             panelClass: ['success-snackbar']
//           });
//           this.router.navigate(['/products']);
//         },
//         error: (err) => {
//           this.isSubmitting = false;
//           this.snackBar.open(err.message || 'Error creating product', 'Dismiss', {
//             duration: 5000,
//             panelClass: ['error-snackbar']
//           });
//         },
//         complete: () => this.isSubmitting = false
//       });
//     }
//   }
// }
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatError,
    MatDialogContent
  ],
  templateUrl: './product-add-edit.component.html',
  styleUrls: ['./product-add-edit.component.scss']
})
export class ProductAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  product!: Product ;
  productForm!: FormGroup;
  isEdit = false;
  productId?: number;
  isLoading = false;
constructor(private dialogRef: MatDialogRef<ProductAddEditComponent>,@Inject(MAT_DIALOG_DATA) public data: Product ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private checkEditMode(): void {
    if (this.data) {
      this.isEdit = true;
      this.product.Id = this.data.Id;
      this.product.Name = this.data.Name;
      this.product.Description = this.data.Description;
      this.product.Quantity = this.data.Quantity;
      // Patch form values with existing product data
      this.productForm.patchValue(this.product);
      this.isLoading = false;
    }
  }

  private loadProductData(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load product data');
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;
    this.isLoading = true;

    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, productData).subscribe({
        next: () => this.handleSuccess('Product updated successfully'),
        error: (err) => this.handleError(err, 'update')
      });
    } else {
      this.productService.create(productData).subscribe({
        next: () => this.handleSuccess('Product created successfully'),
        error: (err) => this.handleError(err, 'create')
      });
    }
  }

  private handleSuccess(message: string): void {
    this.isLoading = false;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    this.dialogRef.close(true)
  }
  CloseDislog() :void{
    this.dialogRef.close(false)
  }
  private handleError(error: Error, operation: string): void {
    this.isLoading = false;
    console.error(`Error during ${operation} operation:`, error);
    this.showError(`Failed to ${operation} product: ${error.message}`);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}