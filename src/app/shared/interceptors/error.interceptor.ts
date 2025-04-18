import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      
      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMsg = `Erreur: ${error.error.message}`;
      } else {
        // Erreur côté serveur
        switch (error.status) {
          case 401:
            errorMsg = 'Non autorisé. Veuillez vous connecter.';
            break;
          case 403:
            errorMsg = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
            break;
          case 404:
            errorMsg = 'Ressource non trouvée.';
            break;
          case 500:
            errorMsg = 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          default:
            errorMsg = `Erreur ${error.status}: ${error.message}`;
        }
      }
      
      console.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
};
