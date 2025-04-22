import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/v1/api/user';
  private authHeader = 'Basic ' + btoa('user:password');
  
  constructor(private http: HttpClient) { }
  
  // Headers HTTP avec authentification
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authHeader
    });
  }
  
  // Message de bienvenue
  getWelcomeMessage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/welcome`, { headers: this.getHeaders() });
  }
  
  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(users => users.map(user => this.mapBackendToFrontend(user)))
      );
  }
  
  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(user => this.mapBackendToFrontend(user))
      );
  }
  
  // Créer un utilisateur
  createUser(user: User): Observable<User> {
    console.log('Création utilisateur (frontend):', user);
    // Mapper les données du frontend vers le format du backend
    const backendUser = this.mapFrontendToBackend(user);
    console.log('Création utilisateur (backend):', backendUser);
    
    return this.http.post<User>(this.apiUrl, backendUser, { headers: this.getHeaders() })
      .pipe(
        map(createdUser => this.mapBackendToFrontend(createdUser))
      );
  }
  
  // Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    console.log('Mise à jour utilisateur (frontend):', id, user);
    // Mapper les données du frontend vers le format du backend
    const backendUser = this.mapFrontendToBackend(user);
    // S'assurer que l'ID est bien inclus dans l'objet utilisateur
    backendUser.id = id;
    console.log('Mise à jour utilisateur (backend):', backendUser);
    
    return this.http.put<User>(`${this.apiUrl}/${id}`, backendUser, { headers: this.getHeaders() })
      .pipe(
        map(updatedUser => this.mapBackendToFrontend(updatedUser))
      );
  }
  
  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  
  // Mapper les données du backend vers le frontend
  private mapBackendToFrontend(user: User): User {
    // Copier toutes les propriétés existantes
    const mappedUser = { ...user };
    
    // Mapper les propriétés spécifiques
    if (user.firstname !== undefined) {
      mappedUser.firstName = user.firstname;
    }
    
    if (user.name !== undefined) {
      mappedUser.lastName = user.name;
    }
    
    console.log('Utilisateur mappé du backend vers le frontend:', mappedUser);
    return mappedUser;
  }
  
  // Mapper les données du frontend vers le backend
  private mapFrontendToBackend(user: User): User {
    // Copier toutes les propriétés existantes
    const mappedUser = { ...user };
    
    // Mapper les propriétés spécifiques
    if (user.firstName !== undefined) {
      mappedUser.firstname = user.firstName;
    }
    
    if (user.lastName !== undefined) {
      mappedUser.name = user.lastName;
    }
    
    console.log('Utilisateur mappé du frontend vers le backend:', mappedUser);
    return mappedUser;
  }
}
