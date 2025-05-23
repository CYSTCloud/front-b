// src/app/users/user-list/user-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'username', 'firstName', 'lastName', 'email', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  isLoading = true;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    console.log('Chargement des utilisateurs...');
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Utilisateurs chargés:', users);
        this.dataSource.data = users;
        this.isLoading = false;
        
        // Rafraîchir le tableau si nous utilisons MatTableDataSource
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        if (this.dataSource.sort) {
          this.dataSource.sort.sortChange.emit();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.error = `Erreur lors du chargement des utilisateurs: ${err.message || 'Erreur inconnue'}`;
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewUser(id: number): void {
    this.router.navigate(['/users', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    console.log('Demande de suppression de l\'utilisateur:', id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirmation', message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Confirmation de suppression pour l\'utilisateur:', id);
        this.userService.deleteUser(id).subscribe({
          next: () => {
            console.log('Utilisateur supprimé avec succès:', id);
            this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', { duration: 3000 });
            // Attendre un peu avant de recharger pour s'assurer que le backend a bien traité la requête
            setTimeout(() => this.loadUsers(), 300);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de l\'utilisateur:', id, err);
            this.snackBar.open(`Erreur lors de la suppression: ${err.message || 'Erreur inconnue'}`, 'Fermer', { duration: 3000 });
          }
        });
      } else {
        console.log('Suppression annulée par l\'utilisateur');
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/users/new']);
  }

  refreshData(): void {
    this.loadUsers();
  }
}