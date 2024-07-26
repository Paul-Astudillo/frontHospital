import { Component, ElementRef, ViewChild} from '@angular/core';
import { AudioRecorderService } from 'src/app/audio-recorder.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import Swal from 'sweetalert2';

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
  icono: boolean = true;
  predictionUrl: string | null = null;
  mensaje: string = ''

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
      this.icono=false
      this.t1cFile = file;
    } else if (fileType === 't2f') {
      this.icono=false
      this.t2fFile = file;
    }
  }
  
  onUpload(): void {
    if (this.t1cFile && this.t2fFile) {
      this.uploadFilesService.uploadFiles(this.t1cFile, this.t2fFile).subscribe(
        blob => {
          this.createImageFromBlob(blob);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Predicción recibida exitosamente!",
            showConfirmButton: false,
            timer: 1500
          });
        },
        error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al subir archivo:"+ error,
          });
          console.error('Upload failed!', error);
        }
      );
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Por favor, selecciona ambos archivos para subir",
        showConfirmButton: false,
        timer: 1500
      });
      //alert('Por favor, selecciona ambos archivos para subir.');
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
    this.audioRecorderService.startRecording().then(
      mensaje => {
        this.mensaje = mensaje;
      },
      error => {
        console.error('Error:', error);
        this.mensaje = 'Recording failed. Please try again.';
      }
    );;
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
