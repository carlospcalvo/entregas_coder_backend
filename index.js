"use strict";
class User {
    nombre;
    apellido;
    libros;
    mascotas;
    
    constructor(nombre, apellido, libros = [], mascotas = []) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`;
    }

    addMascota(nombreMascota) {
        this.mascotas.push(nombreMascota);
    }

    countMascotas() {
        return this.mascotas.length;
    }

    addBook(nombre, autor) {
        this.libros.push({
            nombre,
            autor
        });
    }

    getBookNames() {
        return this.libros.map(libro => libro.nombre);
    }
}
