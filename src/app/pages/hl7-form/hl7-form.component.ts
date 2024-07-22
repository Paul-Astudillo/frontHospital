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

  //archivos
  selectedFiles: FileList | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private audioRecorderService: AudioRecorderService, private uploadFilesService: UploadFilesService) {
    this.audioRecorderService.recordedBlob$.subscribe(data => {
      this.blobUrl = URL.createObjectURL(data.blob);
    });
    this.audioRecorderService.recordingFailed$.subscribe(() => {
      alert('Recording failed');
    });
  }

  onFileSelected(event : any): void{
    this.selectedFiles = event.target.files;
  }
  onUpload(): void {
    if (this.selectedFiles) {
      this.uploadFilesService.uploadFiles(this.selectedFiles).subscribe(
        response => {
          console.log('Upload successful!', response);
          alert('Archivos subidos exitosamente!');
        },
        error => {
          console.error('Upload failed!', error);
          alert('Error al subir archivos: ' + error);
        }
      );
    } else {
      alert('Por favor, selecciona archivos para subir.');
    }
  }

  onAreaClick(fileInput: ElementRef): void {
    fileInput.nativeElement.click();
  }

  onFileDrop(event: any): void {
    event.preventDefault();
    this.selectedFiles = event.dataTransfer.files;
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
