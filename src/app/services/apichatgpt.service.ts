import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApichatgptService {

  private apiUrl = 'http://127.0.0.1:8000/apiVoice/chat-gpt/';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { message: message };
    return this.http.post<any>(this.apiUrl, body, { headers: headers });
  }

}
