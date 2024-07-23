import { Component, ElementRef, ViewChild} from '@angular/core';
import { AudioRecorderService } from 'src/app/audio-recorder.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';

@Component({
  selector: 'app-hl7-form',
  templateUrl: './hl7-form.component.html',
  styleUrls: ['./hl7-form.component.css']
})
export class Hl7FormComponent {
    paciente = {
    nombre: '',
    id: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    celular: '',
    correo: '',
    diagnostico: '',
    alergias: ''
  };
  isRecording = false;
  blobUrl: string | null = null;

  //
  t1cFile: File | null = null;
  t2fFile: File | null = null;
  predictionUrl: string | null = null;


  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private audioRecorderService: AudioRecorderService, private uploadFilesService: UploadFilesService) {
    this.audioRecorderService.recordedBlob$.subscribe(data => {
      this.blobUrl = URL.createObjectURL(data.blob);
    });
    this.audioRecorderService.recordingFailed$.subscribe(() => {
      alert('Recording failed');
    });
  }

  onFileSelected(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (fileType === 't1c') {
      this.t1cFile = file;
    } else if (fileType === 't2f') {
      this.t2fFile = file;
    }
  }

  onUpload(): void {
    if (this.t1cFile && this.t2fFile) {
      this.uploadFilesService.uploadFiles(this.t1cFile, this.t2fFile).subscribe(
        blob => {
          this.createImageFromBlob(blob);
          alert('Predicción recibida exitosamente!');
        },
        error => {
          console.error('Upload failed!', error);
          alert('Error al subir archivo: ' + error);
        }
      );
    } else {
      alert('Por favor, selecciona ambos archivos para subir.');
    }
  }

  private createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.predictionUrl = reader.result as string;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  onAreaClick(fileInput: ElementRef): void {
    fileInput.nativeElement.click();
  }

  // onFileDrop(event: any): void {
  //   event.preventDefault();
  //   this.selectedFiles = event.dataTransfer.files;
  // }

  onFileDrop(event: DragEvent, fileType: string): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      if (fileType === 't1c') {
        this.t1cFile = file;
      } else if (fileType === 't2f') {
        this.t2fFile = file;
      }
    }
  }

  startRecording() {
    const svg = document.querySelector('.btn-primary svg');
    svg?.classList.toggle('animate');
    this.isRecording = true;
    this.audioRecorderService.startRecording();
  }

  stopRecording() {
    const svg = document.querySelector('.btn-primary svg');
    svg?.classList.toggle('animate');
    this.isRecording = false;
    this.audioRecorderService.stopRecording();
    this.llenarFormularioConDatosAleatorios();
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
  llenarFormularioConDatosAleatorios() {
    this.paciente = {
      nombre: 'John Doe',
      id: '123456',
      fechaNacimiento: '01/01/1980',
      genero: 'Masculino',
      direccion: '123 Calle Principal',
      celular: '555-1234',
      correo: 'john.doe@example.com',
      diagnostico: 'Diagnóstico aleatorio',
      alergias: 'Ninguna'
    };
  }
}
