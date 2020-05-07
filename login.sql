create database capstone;
use capstone;
create table login (
	id varchar(20) not null primary key,
    password varchar(512) not null,
    salt varchar(512) not null
);