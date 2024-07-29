import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { observeNotification } from 'rxjs/internal/Notification';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private uploadUrl = 'http://localhost:8000/api/subirtomografia';
  private uploadUrlForAudio ='http://localhost:8000/apiVoice/subiraudio';

  constructor(private http: HttpClient) { }


  uploadFiles(t1cFile: File, t2fFile: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('t1c_file', t1cFile, t1cFile.name);
    formData.append('t2f_file', t2fFile, t2fFile.name);    

    return this.http.post(this.uploadUrl, formData, {
      responseType: 'blob',
      observe: 'response'
    }).pipe( 
      map(response => response.body as Blob),
      catchError(this.handleError)
    );
  }
  uploadAudio(audio: Blob): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', audio, 'audio.wav');
    return this.http.post(this.uploadUrlForAudio, formData, {
      responseType: 'json',
    }).pipe( 
      map(response => response),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
