SHOW databases;

CREATE DATABASE testdb;

USE testdb;

SHOW TABLES;

CREATE TABLE country (
	id varchar(3) primary key,
    name varchar(250) not null,
    phoneCode varchar(5) not null
);

INSERT INTO country(id, name, phoneCode) VALUES ( 'BR', 'Brasil', '55' );

CREATE TABLE state (
	id varchar(3) primary key,
    name varchar(250),
    phoneCode varchar(5),
    country varchar(3),
    FOREIGN KEY (country) references country(id)
);

INSERT INTO state(id, name, phoneCode, country) VALUES ( 'RS', 'Rio Grande do Sul', '54', 'BR' );

CREATE TABLE city(
	id varchar(5) primary key,
    name varchar(250),
    phoneCode varchar(5),
    state varchar(3),
    FOREIGN KEY (state) references state(id)
);

INSERT INTO city(id, name, phoneCode, state) VALUES ( 'PF', 'Passo Fundo', '54', 'RS' );
INSERT INTO city(id, name, phoneCode, state) VALUES ( 'CZO', 'Carazinho', '54', 'RS' );

DROP TABLE appointment;
DROP TABLE barberShopWorker;
DROP TABLE barberShop;
DROP TABLE barber;
DROP TABLE customer;

CREATE TABLE barberShop(

	id bigint auto_increment primary key,
    name varchar(150) not null, 
    city varchar(5) not null,
    neighborhood varchar(100) not null,
    street varchar(100) not null,
    number varchar(100) not null,
    complement varchar(125),
    phone varchar(100) unique not null,
	wppId varchar(500) unique not null,
	#@-28.2905353,-52.7868431
    geolocationLatitude Decimal(8,6),
	geolocationLongitude Decimal(9,6),
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
	modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO barberShop(name, city, neighborhood, street, number, geolocationLatitude, geolocationLongitude ) VALUES( 'Barbearia do Gabriel', 'CZO', 'Centro', 'Alexandre da Motta', '1264', -28.2905353, -52.7868431 );
SELECT * FROM barberShop;
#DELETE FROM barberShop WHERE id > 0;

CREATE TABLE customer (
	id varchar(500) primary key,
    name varchar(5000),
    phone varchar(150) unique not null
);

INSERT INTO customer (id, name, phone) VALUES ('555499026453@c.us','Gabriel','555499026453');

CREATE TABLE barber (
	id varchar(500) primary key,
    name varchar(5000),
    phone varchar(150) unique not null
);

INSERT INTO barber (id, name, phone) VALUES ('555499026453@c.us','Gabriel','555499026453');

CREATE TABLE barberShopWorker (
	id bigint unique auto_increment,
	barberShop bigint not null,
    worker varchar(500) not null,
    PRIMARY KEY (id, barberShop, worker),
	FOREIGN KEY (barberShop) REFERENCES barberShop(id),
    FOREIGN KEY (worker) REFERENCES barber(id)
);

INSERT INTO barberShopWorker (barberShop, worker) VALUES (1, '555499026453@c.us');
    
CREATE TABLE appointmentStatus(
	id varchar(50) primary key,
    description varchar(250)
);

INSERT INTO appointmentStatus(id) VALUES ('Agendado');
INSERT INTO appointmentStatus(id) VALUES ('Concluído');
INSERT INTO appointmentStatus(id) VALUES ('Cancelado');
     
CREATE TABLE appointment (

	id bigint unique auto_increment,
	createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
	modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy varchar(500),
    modifiedBy varchar(500),
    customer varchar(500),
    dayAndTime timestamp not null DEFAULT CURRENT_TIMESTAMP ,
    barberShop bigint not null,
    barberShopWorker bigint not null,
    appointmentStatus varchar(50) not null,
    PRIMARY KEY (id, dayAndTime, barberShop, barberShopWorker),
	FOREIGN KEY (barberShop) REFERENCES barberShop(id),
    FOREIGN KEY (barberShopWorker) REFERENCES barberShopWorker(id),
    FOREIGN KEY (appointmentStatus) REFERENCES appointmentStatus(id)
);

SELECT * FROM barberShop;
SELECT * FROM barberShopWorker;

INSERT INTO appointment (customer, barberShop, barberShopWorker, appointmentStatus) VALUES ('555499026453@c.us', 1, 1, 'Agendado');

SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt,
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.name, bs.phone, bs.city, cy.name as cityName, bs.neighborhood, bs.street, bs.number, bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId,
                b.id AS workerId, b.name AS workerName, b.phone AS workerPhone 
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                JOIN customer AS c ON c.id = a.customer
                JOIN city AS cy ON cy.id = bs.city