import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadFilesService } from './services/upload-files.service';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  private chunks: any[] = [];
  private mediaRecorder: any;
  private audioBlob: any;

  private recordingFailedSubject = new Subject<void>();
  private recordedBlobSubject = new Subject<any>();
  constructor(private uploadFilesService: UploadFilesService){}
  recordingFailed$ = this.recordingFailedSubject.asObservable();
  recordedBlob$ = this.recordedBlobSubject.asObservable();

  startRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.chunks = [];

          this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            this.chunks.push(event.data);
          };

          this.mediaRecorder.onstop = () => {
            this.audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
            this.uploadFilesService.uploadAudio(this.audioBlob).subscribe(
              response => {
                const transcription = response.transcription || 'No transcription found';
                resolve(transcription);
                console.log(transcription);
              },
              error => {
                console.error('Error:', error);
                reject(error);
              }
            );
            this.recordedBlobSubject.next({ blob: this.audioBlob });
          };

          this.mediaRecorder.start();
        }).catch(error => {
          console.error('Error accessing media devices.', error);
          reject(error);
        });
      } else {
        reject('Media devices not supported');
      }
    });
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
}
