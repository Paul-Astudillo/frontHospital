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
    id: '',
    edad: '',
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
  mensaje: string = '';
  response: string= '';

  // mensaje: string = `Extrae la informacion del Paciente y devuelve como un Json: Buenos días, señor González. ¿Cómo se encuentra hoy?

  // Buenos días, doctor. Me siento un poco mejor, gracias. ¿Qué necesitamos revisar hoy?
  
  // Vamos a completar algunos datos para actualizar su expediente. ¿Puede decirme su nombre completo?
  
  // Claro, mi nombre es Juan Carlos González.
  
  // Perfecto, Juan Carlos. ¿Cuál es su ID de paciente?
  
  // Mi ID es 987654.
  
  // ¿Y cuántos años tiene, Juan Carlos?
  
  // Tengo 45 años.
  
  // Entendido. ¿Cuál es su género?
  
  // Soy masculino.
  
  // Muy bien. ¿Me puede proporcionar su dirección actual?
  
  // Sí, vivo en la Calle Falsa 123, Ciudad Ficticia.
  
  // Gracias. ¿Y su número de celular?
  
  // Mi número de celular es 123-456-7890.
  
  // Perfecto. ¿Podría darme su correo electrónico?
  
  // Claro, es juancarlos.gonzalez@example.com.
  
  // Gracias. Ahora, respecto a su diagnóstico, ¿podría describirme brevemente sus síntomas y el diagnóstico actual?
  
  // He tenido dolores de cabeza constantes y náuseas. El diagnóstico actual es migraña crónica.
  
  // Entendido. ¿Tiene alguna alergia que debamos tener en cuenta?
  
  // Sí, soy alérgico a la penicilina.
  
  // Muy bien, Juan Carlos. Hemos completado toda la información necesaria. ¿Hay algo más que quiera agregar?
  
  // No, eso sería todo, doctor. Muchas gracias.
  
  // De nada, Juan Carlos. Cuídese mucho y estamos en contacto para cualquier cosa que necesite.`;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private audioRecorderService: AudioRecorderService, private uploadFilesService: UploadFilesService , private apichatgptService: ApichatgptService) {  
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
  llenarFormularioConDatosAleatorios() {
    this.paciente = {
      nombre: 'John Doe',
      id: '123456',
      edad: '20',
      genero: 'Masculino',
      direccion: '123 Calle Principal',
      celular: '555-1234',
      correo: 'john.doe@example.com',
      diagnostico: 'Diagnóstico aleatorio',
      alergias: 'Ninguna'
    };
  }

  prompt: string = "Del siguiente texto extrae informacion del paciente, como nombres, correo, edad, id, alergias, sintomas, un prediagnostico, etc. Todo esta info devuelve en un archivo Json : "

  sendMessage() {
    console.log('promtp '+this.prompt)
    this.mensaje = this.prompt + this.mensaje 
    this.apichatgptService.sendMessage(this.mensaje).subscribe(
      data => {
        this.response = data.response;
      },
      error => {
        console.error('Error:', error);
      }
    );

    console.log('repuesta '+this.response)
    console.log(typeof(this.response))
  }

}



// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { AudioRecorderService } from 'src/app/audio-recorder.service';
// import { UploadFilesService } from 'src/app/services/upload-files.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-hl7-form',
//   templateUrl: './hl7-form.component.html',
//   styleUrls: ['./hl7-form.component.css']
// })
// export class Hl7FormComponent {
//   paciente = {
//     nombre: '',
//     id: '',
//     edad: '',
//     genero: '',
//     direccion: '',
//     celular: '',
//     correo: '',
//     diagnostico: '',
//     alergias: ''
//   };
//   isRecording = false;
//   blobUrl: string | null = null;
//   t1cFile: File | null = null;
//   t2fFile: File | null = null;
//   icono: boolean = true;
//   predictionUrl: string | null = null;
//   mensaje: string = '';
// //   mensaje: string = `Buenos días, señor González. ¿Cómo se encuentra hoy?

// // Buenos días, doctor. Me siento un poco mejor, gracias. ¿Qué necesitamos revisar hoy?

// // Vamos a completar algunos datos para actualizar su expediente. ¿Puede decirme su nombre completo?

// // Claro, mi nombre es Juan Carlos González.

// // Perfecto, Juan Carlos. ¿Cuál es su ID de paciente?

// // Mi ID es 987654.

// // ¿Y cuántos años tiene, Juan Carlos?

// // Tengo 45 años.

// // Entendido. ¿Cuál es su género?

// // Soy masculino.

// // Muy bien. ¿Me puede proporcionar su dirección actual?

// // Sí, vivo en la Calle Falsa 123, Ciudad Ficticia.

// // Gracias. ¿Y su número de celular?

// // Mi número de celular es 123-456-7890.

// // Perfecto. ¿Podría darme su correo electrónico?

// // Claro, es juancarlos.gonzalez@example.com.

// // Gracias. Ahora, respecto a su diagnóstico, ¿podría describirme brevemente sus síntomas y el diagnóstico actual?

// // He tenido dolores de cabeza constantes y náuseas. El diagnóstico actual es migraña crónica.

// // Entendido. ¿Tiene alguna alergia que debamos tener en cuenta?

// // Sí, soy alérgico a la penicilina.

// // Muy bien, Juan Carlos. Hemos completado toda la información necesaria. ¿Hay algo más que quiera agregar?

// // No, eso sería todo, doctor. Muchas gracias.

// // De nada, Juan Carlos. Cuídese mucho y estamos en contacto para cualquier cosa que necesite.`;

//   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

//   constructor(private audioRecorderService: AudioRecorderService, private uploadFilesService: UploadFilesService) {
//     this.audioRecorderService.recordedBlob$.subscribe(data => {
//       this.blobUrl = URL.createObjectURL(data.blob);
//     });
//     this.audioRecorderService.recordingFailed$.subscribe(() => {
//       alert('Recording failed');
//     });
//   }

//   onFileSelected(event: any, fileType: string): void {
//     const file = event.target.files[0];
//     if (fileType === 't1c') {
//       this.icono = false;
//       this.t1cFile = file;
//     } else if (fileType === 't2f') {
//       this.icono = false;
//       this.t2fFile = file;
//     }
//   }
  
//   onUpload(): void {
//     if (this.t1cFile && this.t2fFile) {
//       this.uploadFilesService.uploadFiles(this.t1cFile, this.t2fFile).subscribe(
//         blob => {
//           this.createImageFromBlob(blob);
//           Swal.fire({
//             position: "center",
//             icon: "success",
//             title: "Predicción recibida exitosamente!",
//             showConfirmButton: false,
//             timer: 1500
//           });
//         },
//         error => {
//           Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Error al subir archivo:" + error,
//           });
//           console.error('Upload failed!', error);
//         }
//       );
//     } else {
//       Swal.fire({
//         position: "center",
//         icon: "warning",
//         title: "Por favor, selecciona ambos archivos para subir",
//         showConfirmButton: false,
//         timer: 1500
//       });
//     }
//   }

//   private createImageFromBlob(image: Blob): void {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => {
//       this.predictionUrl = reader.result as string;
//     }, false);

//     if (image) {
//       reader.readAsDataURL(image);
//     }
//   }

//   onAreaClick(fileInput: ElementRef): void {
//     fileInput.nativeElement.click();
//   }

//   onFileDrop(event: DragEvent, fileType: string): void {
//     event.preventDefault();
//     const file = event.dataTransfer?.files[0];
//     if (file) {
//       if (fileType === 't1c') {
//         this.t1cFile = file;
//       } else if (fileType === 't2f') {
//         this.t2fFile = file;
//       }
//     }
//   }

//   startRecording() {
//     const svg = document.querySelector('.btn-primary svg');
//     svg?.classList.toggle('animate');
//     this.isRecording = true;
//     this.audioRecorderService.startRecording().then(
//       mensaje => {
//         this.mensaje = mensaje;
//       },
//       error => {
//         console.error('Error:', error);
//         this.mensaje = 'Recording failed. Please try again.';
//       }
//     );
//   }

//   stopRecording() {
//     const svg = document.querySelector('.btn-primary svg');
//     svg?.classList.toggle('animate');
//     this.isRecording = false;
//     this.audioRecorderService.stopRecording();
//     this.llenarFormularioConDatosDelMensaje();
//   }

//   downloadAudio() {
//     if (this.blobUrl) {
//       const a = document.createElement('a');
//       a.href = this.blobUrl;
//       a.download = 'recording.mp3';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }
//   }

//   llenarFormularioConDatosDelMensaje() {
//     const lines = this.mensaje.split('\n');

//     this.paciente.nombre = this.extraerValor(lines, 'mi nombre es');
//     this.paciente.id = this.extraerValor(lines, 'Mi ID es');
//     this.paciente.edad = this.extraerValor(lines, 'Tengo');
//     this.paciente.genero = this.extraerValor(lines, 'Soy');
//     this.paciente.direccion = this.extraerValor(lines, 'vivo en');
//     this.paciente.celular = this.extraerValor(lines, 'Mi número de celular es');
//     this.paciente.correo = this.extraerValor(lines, 'es', '@');
//     this.paciente.diagnostico = this.extraerValor(lines, 'El diagnóstico actual es');
//     this.paciente.alergias = this.extraerValor(lines, 'alérgico a');
//   }

//   extraerValor(lines: string[], keyword: string, additionalStopChar: string = ''): string {
//     for (let line of lines) {
//       if (line.includes(keyword)) {
//         let result = line.split(keyword)[1].trim();
//         if (additionalStopChar) {
//           const endIdx = result.indexOf(additionalStopChar);
//           if (endIdx !== -1) {
//             result = result.substring(0, endIdx + additionalStopChar.length);
//           }
//         }
//         return result.replace('.', '');
//       }
//     }
//     return '';
//   }
// }
