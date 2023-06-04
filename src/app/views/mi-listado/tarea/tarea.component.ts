import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Itarea } from 'src/app/itarea';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {
  @Input() estaTarea!: Itarea;
  @Output() deleteTarea = new EventEmitter<string>();
  @Output() tareaUpdated = new EventEmitter<Itarea>();

  tareaForm = new FormGroup({
    fecha: new FormControl(''),
    hora: new FormControl(''),
    titulo: new FormControl(''),
    detalle: new FormControl(''),
    estado: new FormControl('pendiente'),
  });
  editMode = false;

  ngOnInit(): void {
    this.tareaForm.setValue({
      fecha: this.formatDate(this.estaTarea.fecha),
      hora: this.estaTarea.hora,
      titulo: this.estaTarea.titulo,
      detalle: this.estaTarea.detalle,
      estado: this.estaTarea.estado
    });
  }

  startEdit(): void {
    this.tareaForm.setValue({
      fecha: this.formatDate(this.estaTarea.fecha),
      hora: this.estaTarea.hora,
      titulo: this.estaTarea.titulo,
      detalle: this.estaTarea.detalle,
      estado: this.estaTarea.estado
    });
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
  }
  updateTarea(): void {
    if (this.tareaForm.valid) {
      let fechaValue = this.tareaForm.get('fecha')!.value;
      let fecha = fechaValue ? new Date(fechaValue) : new Date();
      this.estaTarea = {
        ...this.estaTarea,
        fecha: fecha,
        hora: this.tareaForm.get('hora')!.value || '',
        titulo: this.tareaForm.get('titulo')!.value || '',
        detalle: this.tareaForm.get('detalle')!.value || '',
        estado: this.tareaForm.get('estado')!.value || 'pendiente',
      };
      this.tareaUpdated.emit(this.estaTarea);
      this.editMode = false;
    }
  }
  

  formatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  updateEstado(nuevoEstado: string): void {
    this.tareaForm.get('estado')!.setValue(nuevoEstado);
    this.updateTarea();
  }

}
  
