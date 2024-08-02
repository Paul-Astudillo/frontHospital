import { compileNgModule } from '@angular/compiler';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { config } from 'rxjs';
import { AudioRecorderService } from 'src/app/audio-recorder.service';
import { ApichatgptService } from 'src/app/services/apichatgpt.service';
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
    cedula: '',
    edad: 0,
    genero: 'Masculino',
    direccion: '',
    celular: '',
    correo: '',
    diagnostico: '',
    alergias: '',
    sintomas: '',
    medicacion:''
  };
  isRecording = false;
  isLoading: boolean = false;
  blobUrl: string | null = null;

  t1cFile: File | null = null;
  t2fFile: File | null = null;
  icono: boolean = true;
  predictionUrl: string | null = null;
  mensaje: string = '';
  response: string= '';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private audioRecorderService: AudioRecorderService, private uploadFilesService: UploadFilesService , private apichatgptService: ApichatgptService) {  
    this.audioRecorderService.recordedBlob$.subscribe(data => {
      this.blobUrl = URL.createObjectURL(data.blob);
    });
    this.audioRecorderService.recordingFailed$.subscribe(() => {
      alert('Recording failed');
    });
  }
  showLoadingScreen() {
    this.isLoading = true;
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
    this.paciente.nombre ='';
        this.paciente.cedula ='';
        this.paciente.edad = 0;
        this.paciente.genero ='';
        this.paciente.direccion ='';
        this.paciente.celular ='';
        this.paciente.correo ='';
        this.paciente.diagnostico ='';
        this.paciente.alergias ='';
        this.paciente.sintomas ='';
        this.paciente.medicacion ='';
    const svg = document.querySelector('.btn-primary svg');
    svg?.classList.toggle('animate');
    this.isRecording = true;
    this.audioRecorderService.startRecording().then(
      mensaje => {
        this.mensaje = mensaje;
        console.log(this.mensaje);
        if(this.mensaje!=null){
          console.log("hola entre "+this.isLoading)
          this.sendMessage();
        }else{
          console.log("mensaje vacio: "+"'"+this.mensaje+"'")
          this.isLoading=false;
        }
      },
      error => {
        console.error('Error:', error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Recording failed. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });
        this.isRecording = false;
      }
    );;
  }

  stopRecording() {
    const svg = document.querySelector('.btn-primary svg');
    svg?.classList.toggle('animate');
    this.isRecording = false;
    this.showLoadingScreen();
    this.audioRecorderService.stopRecording();
  
    
    //this.llenarFormularioConDatosAleatorios();
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

  prompt: string = "De la siguiente conversacion extrae informacion del paciente, como nombres, correo, edad solo numeros, cedula, alérgias, síntomas,medicación, con los datos de alergias, sintomas, medicacion dame un prediagnóstico y ponle en el campo diagnostico, etc. Todo esta info devuelve en un archivo Json para rellenar esta clase paciente = { nombre: '',cedula: '',edad: 0,genero: 'Masculino',direccion: '',celular: '',correo: '',diagnostico: '',alergias: '',sintomas: '',medicacion:''}, en caso de que no hay datos de donde obtener manda un mensaje de que faltan datos: "

  sendMessage() {
    console.log('prompt ' + this.prompt);
    this.mensaje = this.prompt + this.mensaje;
    this.apichatgptService.sendMessage(this.mensaje).subscribe(
        data => {
            this.response = data.response;
            console.log(this.response);
            const responseData = JSON.parse(this.response);

            if (responseData.error && responseData.error === 'El texto proporcionado no contiene la información necesaria para extraer los datos del paciente') {
                // Mostrar alerta cuando falta información
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Falta de datos para extraer información",
                    showConfirmButton: false,
                    timer: 1500
                });
                this.isLoading=false
            } else {
                // Assign the values to the paciente object
                this.paciente.nombre = responseData.nombre || '';
                this.paciente.cedula = responseData.cedula || '';
                this.paciente.edad = responseData.edad || '';
                this.paciente.genero = responseData.genero || '';
                this.paciente.direccion = responseData.direccion || '';
                this.paciente.celular = responseData.celular || '';
                this.paciente.correo = responseData.correo || '';
                this.paciente.diagnostico = responseData.diagnostico || '';
                this.paciente.alergias = responseData.alergias || '';
                this.paciente.sintomas = responseData.sintomas || '';
                this.paciente.medicacion = responseData.medicacion || '';
                this.isLoading = false;
            }
        },
        error => {
            console.error('Error:', error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: error,
                showConfirmButton: false,
                timer: 1500
            });
        }
    );

    console.log('respuesta ' + this.response);
    console.log(typeof(this.response));
}

}
