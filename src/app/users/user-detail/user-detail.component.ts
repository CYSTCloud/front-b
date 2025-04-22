import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadUser(+id);
      } else {
        this.error = 'ID d\'utilisateur non spécifié';
        this.isLoading = false;
      }
    });
  }

  loadUser(id: number): void {
    console.log('Chargement des détails de l\'utilisateur:', id);
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        console.log('Détails de l\'utilisateur chargés:', user);
        this.user = user;
        this.isLoading = false;
        
        // Vérifier que tous les champs nécessaires sont présents
        if (!user.firstName || !user.lastName) {
          console.warn('Attention: Certains champs sont manquants dans les données de l\'utilisateur', user);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        this.error = `Erreur lors du chargement de l'utilisateur: ${err.message || 'Erreur inconnue'}`;
        this.isLoading = false;
      }
    });
  }

  editUser(): void {
    if (this.user?.id) {
      console.log('Redirection vers la page d\'édition pour l\'utilisateur:', this.user.id);
      
      // Utiliser window.location.href au lieu de router.navigate pour contourner les problèmes de navigation
      window.location.href = `/users/edit/${this.user.id}`;
      
      // Alternative avec router.navigate (commentée car peut ne pas fonctionner dans certains cas)
      // this.router.navigate(['/users/edit', this.user.id]);
    } else {
      console.warn('Tentative d\'édition d\'un utilisateur sans ID');
    }
  }

  deleteUser(): void {
    if (!this.user?.id) {
      console.warn('Tentative de suppression d\'un utilisateur sans ID');
      return;
    }

    console.log('Demande de suppression de l\'utilisateur:', this.user.id);
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('Confirmation de suppression pour l\'utilisateur:', this.user.id);
      
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          console.log('Utilisateur supprimé avec succès:', this.user?.id);
          alert('Utilisateur supprimé avec succès');
          // Utiliser window.location.href au lieu de router.navigate pour contourner les problèmes de navigation
          window.location.href = '/users';
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', this.user?.id, err);
          alert(`Erreur lors de la suppression: ${err.message || 'Erreur inconnue'}`);
        }
      });
    } else {
      console.log('Suppression annulée par l\'utilisateur');
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
