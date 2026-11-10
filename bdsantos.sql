create database bdsantos;
use bdsantos;

create table estado(
    id int,
    nombre varchar(30) not null,
    constraint pk_estado primary key(id),
    constraint uq_estado_nombre unique(nombre)
);

create table tipo_usuario(
    id int,
    nombre varchar(30) not null,
    constraint pk_tipo_usuario primary key(id),
    constraint uq_tipo_usuario_nombre unique(nombre)
);

create table usuario(
    username varchar(30),
    password varchar(255) not null,
    nombre varchar(120) not null,
    edad int not null,
    id_estado int not null,
    id_tipo_usuario int not null,
    constraint pk_usuario primary key(username),
    constraint fk_usuario_estado foreign key(id_estado)
    references estado(id),
    constraint fk_usuario_tipo_usuario foreign key(id_tipo_usuario)
    references tipo_usuario(id)
);

INSERT INTO estado(id,nombre)
VALUES
(1, 'Activo'),
(2, 'Bloqueado'),
(3, 'Retirado');

INSERT INTO tipo_usuario(id,nombre)
VALUES
(1, 'Administrador'),
(2, 'Usuario');

INSERT INTO usuario(username, password, nombre, edad,id_estado,id_tipo_usuario)
VALUES('admin','12345','Administrador',46,1,1);