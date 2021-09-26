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
let usuario = new User('Carlos', 'Calvo', [
    {
        nombre: '1984',
        autor: 'George Orwell'
    },
    {
        nombre: 'For Whom The Bell Tolls',
        autor: 'Ernest Hemingway'
    }
], ['Toto']);
console.log(`Nombre completo: ${usuario.getFullName()}`);
usuario.addMascota('Aretha');
console.log(`Cantidad de mascotas: ${usuario.countMascotas()}`);
usuario.addBook('Animal Farm', 'Goerge Orwell');
console.log(`Libros: ${usuario.getBookNames()}`);
