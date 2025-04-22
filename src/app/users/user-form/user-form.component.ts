import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  userId: number | null = null;
  formTitle = 'Nouvel utilisateur';
  submitButtonText = 'Créer';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Vérifier si nous sommes en mode édition
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.isEditMode = true;
        this.formTitle = 'Modifier l\'utilisateur';
        this.submitButtonText = 'Mettre à jour';
        this.loadUser(this.userId);
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement de l\'utilisateur', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        console.error(err);
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;
    const userData: User = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // Mise à jour d'un utilisateur existant
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Création d'un nouvel utilisateur
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  // Getters pour accéder facilement aux contrôles du formulaire dans le template
  get usernameControl() { return this.userForm.get('username'); }
  get firstNameControl() { return this.userForm.get('firstName'); }
  get lastNameControl() { return this.userForm.get('lastName'); }
  get emailControl() { return this.userForm.get('email'); }
}
