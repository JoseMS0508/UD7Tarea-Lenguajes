import { Component} from '@angular/core';
import { Itarea } from 'src/app/itarea';
import { FormGroup, FormControl } from '@angular/forms';  


@Component({
  selector: 'app-mi-listado',
  templateUrl: './mi-listado.component.html',
  styleUrls: ['./mi-listado.component.css']
})
export class MiListadoComponent {
  listadoTareas: Itarea[] = [];

  tareaAEditar: Itarea | null = null;
  tareaForm = new FormGroup({
    fecha: new FormControl(''),
    hora: new FormControl(''),
    titulo: new FormControl(''),
    detalle: new FormControl(''),
    estado: new FormControl('pendiente'),
  });

  mostrarOpcion = new FormGroup({
    filtrarPorEstado: new FormControl(false),
    estado: new FormControl(''),
    ordenarPorInicio: new FormControl(false),
    orden: new FormControl('')
  });

  constructor() {
    this.getTareasFromLocalStorage();
  }

  ordenarTareasPorFecha(): void {
    this.listadoTareas.sort((a, b) => {
      // Compara las fechas primero
      const fechaDiff = a.fecha.getTime() - b.fecha.getTime();
  
      if (fechaDiff !== 0) {
        return fechaDiff;
      }
  
      // Si las fechas son las mismas, compara las horas
      return this.compararHoras(a.hora, b.hora);
    });
  }
  
  compararHoras(horaA: string, horaB: string): number {
    const [horaA_HH, horaA_MM] = horaA.split(':').map(Number);
    const [horaB_HH, horaB_MM] = horaB.split(':').map(Number);
  
    const horaADiff = horaA_HH * 60 + horaA_MM;
    const horaBDiff = horaB_HH * 60 + horaB_MM;
  
    return horaADiff - horaBDiff;
  }
  

  addTarea(): void {
    const fechaStr = this.tareaForm.get('fecha')!.value;
    const fecha = fechaStr ? new Date(fechaStr) : new Date();
    const nuevaTarea: Itarea = { 
      id: this.tareaAEditar ? this.tareaAEditar.id : new Date().getTime().toString(),
      fecha: fecha,
      hora: this.tareaForm.get('hora')!.value || '',
      titulo: this.tareaForm.get('titulo')!.value || '',
      detalle: this.tareaForm.get('detalle')!.value || '',
      estado: 'pendiente',
    };
  
    if (this.tareaAEditar) {
      // Actualizar tarea existente
      const index = this.listadoTareas.findIndex(tarea => tarea.id === this.tareaAEditar!.id);
      if (index !== -1) {
        this.listadoTareas[index] = nuevaTarea;
      }
    } else {
      // Agregar nueva tarea
      this.listadoTareas.push(nuevaTarea);
    }
    this.ordenarTareasPorFecha();
    this.saveTareasToLocalStorage();
    this.tareaForm.reset();
    this.tareaAEditar = null; // reseteamos tareaAEditar para futuras tareas nuevas
  } 

  getFiltradoYOrdenadoTareas(): Itarea[] {
    let tareas = [...this.listadoTareas];

    if (this.mostrarOpcion.get('filtrarPorEstado')!.value) {
      const estado = this.mostrarOpcion.get('estado')!.value === 'realizado' ? 'realizado' : 'pendiente';
      tareas = tareas.filter(tarea => tarea.estado === estado);
    }

    if (this.mostrarOpcion.get('ordenarPorInicio')!.value) {
      if (this.mostrarOpcion.get('orden')!.value === 'descendente') {
        tareas = tareas.reverse();
      }
    }

    return tareas;
  }

  formatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();
  
    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;
  
    return [year, month, day].join('-');
  }

  updateTarea(updatedTarea: Itarea): void {
    const index = this.listadoTareas.findIndex(tarea => tarea.id === updatedTarea.id);
    if (index !== -1) {
      this.listadoTareas[index] = updatedTarea;
      this.ordenarTareasPorFecha();
      this.saveTareasToLocalStorage();
    }
  }
  
  
  deleteTarea(id: string): void {
    this.listadoTareas = this.listadoTareas.filter(tarea => tarea.id !== id);
    this.saveTareasToLocalStorage();
    this.ordenarTareasPorFecha();
  }

  getTareasFromLocalStorage(): void {
    const tareas = localStorage.getItem('tareas');
    if (tareas) {
      this.listadoTareas = JSON.parse(tareas);
    }
  }

  saveTareasToLocalStorage(): void {
    localStorage.setItem('tareas', JSON.stringify(this.listadoTareas));
  }

  updateEstado(event: any, tareaId: string): void {
    // Obtén el nuevo estado desde el evento de cambio
    const nuevoEstado = event.target.value;
  
    // Encuentra la tarea en listadoTareas
    const tarea = this.listadoTareas.find(t => t.id === tareaId);
    if (!tarea) {
      console.error(`No se encontró la tarea con id ${tareaId}`);
      return;
    }
  
    // Actualiza el estado en la tarea
    tarea.estado = nuevoEstado;
  
    // Guarda las tareas en el almacenamiento local
    this.saveTareasToLocalStorage();
  }

  onTareaUpdated(tareaActualizada: Itarea): void {
    this.updateTarea(tareaActualizada);
  }
  
}
