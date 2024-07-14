import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  private chunks: any[] = [];
  private mediaRecorder: any;
  private audioBlob: any;

  private recordingFailedSubject = new Subject<void>();
  private recordedBlobSubject = new Subject<any>();

  recordingFailed$ = this.recordingFailedSubject.asObservable();
  recordedBlob$ = this.recordedBlobSubject.asObservable();

  startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.chunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.chunks, { type: 'audio/mp3' });
          this.chunks = [];
          this.recordedBlobSubject.next({ blob: this.audioBlob });
        };
        this.mediaRecorder.start();
      }).catch(() => {
        this.recordingFailedSubject.next();
      });
    } else {
      this.recordingFailedSubject.next();
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
}
