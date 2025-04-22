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
  isSubmitting = false;
  isEditMode = false;
  userId: number | null = null;
  formTitle = 'Nouvel utilisateur';
  submitButtonText = 'Créer';
  error: string | null = null;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialiser le formulaire
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    
    // Vérifier si nous sommes en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.formTitle = 'Modifier l\'utilisateur';
      this.submitButtonText = 'Mettre à jour';
      this.loadUser(this.userId);
    }
    
    console.log('Formulaire initialisé, mode édition:', this.isEditMode);
  }

  loadUser(id: number): void {
    this.isLoading = true;
    console.log('Chargement de l\'utilisateur pour édition, ID:', id);
    
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        console.log('Utilisateur chargé pour édition:', user);
        this.user = user;
        
        // Vérifier que les données sont bien présentes
        if (!user.firstName || !user.lastName) {
          console.warn('Attention: firstName ou lastName manquant dans les données de l\'utilisateur');
        }
        
        this.userForm.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        
        console.log('Formulaire mis à jour avec les valeurs:', this.userForm.value);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        this.error = `Erreur lors du chargement de l'utilisateur: ${err.message || 'Erreur inconnue'}`;
        this.snackBar.open('Erreur lors du chargement de l\'utilisateur', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      console.warn('Formulaire invalide, soumission annulée');
      return;
    }

    this.isSubmitting = true;
    const userData: User = this.userForm.value;
    console.log('Données du formulaire à soumettre:', userData);

    if (this.isEditMode && this.userId) {
      // Mise à jour d'un utilisateur existant
      console.log('Mode édition: mise à jour de l\'utilisateur', this.userId);
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (updatedUser) => {
          console.log('Utilisateur mis à jour avec succès:', updatedUser);
          this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.isSubmitting = false;
          // Utiliser window.location.href au lieu de router.navigate pour contourner les problèmes de navigation
          window.location.href = '/users';
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          this.error = `Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`;
          this.snackBar.open(this.error, 'Fermer', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    } else {
      // Création d'un nouvel utilisateur
      console.log('Mode création: nouvel utilisateur');
      this.userService.createUser(userData).subscribe({
        next: (createdUser) => {
          console.log('Nouvel utilisateur créé avec succès:', createdUser);
          this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
          this.isSubmitting = false;
          // Utiliser window.location.href au lieu de router.navigate pour contourner les problèmes de navigation
          setTimeout(() => window.location.href = '/users', 300);
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'utilisateur:', err);
          this.error = `Erreur lors de la création: ${err.message || 'Erreur inconnue'}`;
          this.snackBar.open(this.error, 'Fermer', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    // Utiliser window.location.href au lieu de router.navigate pour contourner les problèmes de navigation
    window.location.href = '/users';
  }

  // Getters pour accéder facilement aux contrôles du formulaire dans le template
  get usernameControl() { return this.userForm.get('username'); }
  get firstNameControl() { return this.userForm.get('firstName'); }
  get lastNameControl() { return this.userForm.get('lastName'); }
  get emailControl() { return this.userForm.get('email'); }
}
