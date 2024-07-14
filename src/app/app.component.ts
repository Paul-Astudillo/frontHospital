import { Component } from '@angular/core';
import { AudioRecorderService } from './audio-recorder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontHospital';
  isRecording = false;
  blobUrl: any;
  recordedBlob: Blob = new Blob();

  constructor(private audioRecorderService: AudioRecorderService) {
    this.audioRecorderService.recordingFailed$.subscribe(() => {
      this.isRecording = false;
      console.error('Recording failed.');
    });

    this.audioRecorderService.recordedBlob$.subscribe((data) => {
      this.recordedBlob = data.blob;
      this.blobUrl = URL.createObjectURL(this.recordedBlob);
      console.log('Blob URL:', this.blobUrl);
    });
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecorderService.startRecording();
      console.log('Recording started...');
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecorderService.stopRecording();
      console.log('Recording stopped.');
    }
  }

  downloadAudio() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = this.blobUrl;
    a.download = 'recording.mp3';
    a.click();
    window.URL.revokeObjectURL(this.blobUrl);
    console.log('Audio downloaded.');
  }
}
