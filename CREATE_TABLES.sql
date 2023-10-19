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


CREATE TABLE appointmentStatus(
	id varchar(50) primary key,
    description varchar(250)
);

INSERT INTO appointmentStatus(id) VALUES ('Agendado');
INSERT INTO appointmentStatus(id) VALUES ('Concluído');
INSERT INTO appointmentStatus(id) VALUES ('Cancelado');

#DROP TABLE appointment;
#DROP TABLE barberShopWorkerService;
#DROP TABLE barberShopWorker;
#DROP TABLE barberShop;
#DROP TABLE barber;
#DROP TABLE customer;

CREATE TABLE barberShop(

	id bigint auto_increment primary key,
    name varchar(150) not null, 
    openForService boolean not null default true,
    city varchar(5) not null,
    availableDays varchar(50) not null, # [0,1,2,3,4,5,6]
    availableHours varchar(1000) not null, # [{"0":["7:30 12:00","13:30 18:00"]}]
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

INSERT INTO barberShop(name, city, availableDays, availableHours, neighborhood, street, number, phone, wppId, geolocationLatitude, geolocationLongitude ) VALUES( 'Barbearia do Gabriel', 'CZO', '[1,2,3,4,5]', '[{"1":["7:30 12:00","13:30 18:00"]}],{"2":["7:30 12:00","13:30 18:00"],{"3":["7:30 12:00","13:30 18:00"]}],{"4":["7:30 12:00","13:30 18:00"]}],{"5":["7:30 12:00","13:30 18:00"]}]}]', 'Centro', 'Alexandre da Motta', '1264', '555499026453', '555499026453@c.us', -28.2905353, -52.7868431 );
SELECT * FROM barberShop;
#DELETE FROM barberShop WHERE id > 0;

CREATE TABLE customer (
	id varchar(500) primary key,
    name varchar(5000),
    phone varchar(150) unique not null
);

#INSERT INTO customer (id, name, phone) VALUES ('555499026453@c.us','Gabriel','555499026453');

CREATE TABLE barber (
	id varchar(500) primary key,
    name varchar(5000),
    phone varchar(150) unique not null
);

#INSERT INTO barber (id, name, phone) VALUES ('555499026453@c.us','Gabriel','555499026453');

CREATE TABLE barberShopWorker (
	id bigint unique auto_increment,
	barberShop bigint not null,
    worker varchar(500) not null, 
    PRIMARY KEY (barberShop, worker),
	FOREIGN KEY (barberShop) REFERENCES barberShop(id),
    FOREIGN KEY (worker) REFERENCES barber(id)
);

#INSERT INTO barberShopWorker (barberShop, worker) VALUES (1, '555499026453@c.us');
     
CREATE TABLE barberShopWorkerService(
	id bigint unique auto_increment,
	name varchar(250) not null,
    description varchar(500),
    durationInMinutes int not null,
    availableDays varchar(500) not null, # [0,1,2,3,4,5,6]
    availableHours varchar(1000) not null, # [{"0":["7:30 12:00","13:30 18:00"]}]
    barberShop bigint not null,
    barberShopWorker bigint not null,
    PRIMARY KEY (name, barberShop, barberShopWorker),
    FOREIGN KEY (barberShop) REFERENCES barberShop(id),
    FOREIGN KEY (barberShopWorker) REFERENCES barberShopWorker(id)
);

ALTER TABLE barberShopWorkerService ADD COLUMN active boolean not null default true;

#INSERT INTO barberShopWorkerService(name, durationInMinutes, availableDays, availableHours, barberShop, barberShopWorker) VALUES('Corte de cabelo', 30, '[1,2,3,4,5]', '[{"1":["7:30 12:00","13:30 18:00"]}],{"2":["7:30 12:00","13:30 18:00"],{"3":["7:30 12:00","13:30 18:00"]}],{"4":["7:30 12:00","13:30 18:00"]}],{"5":["7:30 12:00","13:30 18:00"]}]}]', 1, 1);
     
CREATE TABLE appointment (

	id bigint unique auto_increment,
	createdAt timestamp DEFAULT CURRENT_TIMESTAMP ,
	modifiedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy varchar(500) not null,
    modifiedBy varchar(500) not null,
    customer varchar(500) not null,
    dayAndTime timestamp not null DEFAULT CURRENT_TIMESTAMP ,
    barberShop bigint not null,
    barberShopWorker bigint not null,
    service bigint not null,
    appointmentStatus varchar(50) not null,
    PRIMARY KEY (dayAndTime, barberShop, barberShopWorker),
	FOREIGN KEY (barberShop) REFERENCES barberShop(id),
    FOREIGN KEY (barberShopWorker) REFERENCES barberShopWorker(id),
    FOREIGN KEY (appointmentStatus) REFERENCES appointmentStatus(id),
	FOREIGN KEY (service) REFERENCES barberShopWorkerService(id)
);

SELECT * FROM barberShop;
SELECT * FROM barberShopWorker;

#INSERT INTO appointment (customer, barberShop, barberShopWorker, service, appointmentStatus, createdBy, modifiedBy) VALUES ('555499026453@c.us', 1, 1, 1, 'Agendado', '555499026453@c.us', '555499026453@c.us');

#DROP TABLE wppAllowedDevice;
CREATE TABLE wppAllowedDevice(
	wppId varchar(100) not null,
    hash varchar(512) not null,
    primary key(wppId, hash)
);

SELECT 
                a.id, a.dayAndTime, a.createdBy, a.modifiedBy, a.createdAt, a.modifiedAt, a.appointmentStatus,
                c.id AS customerId, c.name AS customerName, c.phone as customerPhone,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId
                FROM appointment AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id OR a.createdBy = bs.wppId  
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker OR a.createdBy = b.id  
                JOIN customer AS c ON c.id = a.customer OR a.createdBy = c.id  
                JOIN city AS cy ON cy.id = bs.city;
                
                
                SELECT
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName,
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId
                FROM barberShop AS bs
                JOIN city AS cy ON cy.id =  bs.city;
                
                
                SELECT 
                *,
                bs.id as barberShopId, bs.name as barberShopName, bs.phone as barberShopPhone, bs.city as barberShopCity, cy.name as barberShopCityName, 
                bs.neighborhood as barberShopNeighborhood, bs.street as barberShopStreet, bs.number as barberShopNumber, bs.complement barberShopComplement, 
                bs.geolocationLatitude, bs.geolocationLongitude, bs.wppId as barberShopWppId,
                b.id AS workerWppId, b.name AS workerName, b.phone AS workerPhone, bsw.id AS workerId 
                FROM barberShopWorkerService AS a 
                JOIN barberShop AS bs ON a.barberShop = bs.id 
                JOIN barberShopWorker AS bsw ON a.barberShopWorker = bsw.id 
                JOIN barber AS b ON b.id = bsw.worker
                JOIN city AS cy ON cy.id = bs.city;
                
                SELECT * FROM barberShop;
                
                DELETE FROM barberShop WHERE id > 0;
                                DELETE FROM barberShopWorker WHERE id > 0;
                
                SELECT * FROM wppAllowedDevice;