import { Component } from '@angular/core';
import { AudioRecorderService } from 'src/app/audio-recorder.service';

@Component({
  selector: 'app-hl7-form',
  templateUrl: './hl7-form.component.html',
  styleUrls: ['./hl7-form.component.css']
})
export class Hl7FormComponent {
  isRecording = false;
  blobUrl: string | null = null;

  constructor(private audioRecorderService: AudioRecorderService) {
    this.audioRecorderService.recordedBlob$.subscribe(data => {
      this.blobUrl = URL.createObjectURL(data.blob);
    });
    this.audioRecorderService.recordingFailed$.subscribe(() => {
      alert('Recording failed');
    });
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecorderService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecorderService.stopRecording();
  }

  downloadAudio() {
    if (this.blobUrl) {
      const a = document.createElement('a');
      a.href = this.blobUrl;
      a.download = 'recording.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

}
