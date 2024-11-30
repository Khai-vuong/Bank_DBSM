DROP DATABASE IF EXISTS `BankDatabase`;
CREATE DATABASE `BankDatabase`;
USE `BankDatabase`;

CREATE TABLE `branch` (
	branch_name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    no_street INT,
    district VARCHAR(50),
    city VARCHAR(50),
    region VARCHAR(50),
    manager_id INT,
    PRIMARY KEY (branch_name)
);

CREATE TABLE `employee` (
	employee_id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    email VARCHAR(50),
    no_street INT,
    district VARCHAR(50),
    city VARCHAR(50),
    branch_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (employee_id)
);

CREATE TABLE `customer` (
	customer_id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    office_no_street INT,
    office_district VARCHAR(50),
    office_city VARCHAR(50),
    email VARCHAR(50),
    home_no_street INT,
    home_district VARCHAR(50),
    home_city VARCHAR(50),
    serve_id INT,
    PRIMARY KEY (customer_id)
);

CREATE TABLE `branch_phone_number` (
	phone_number VARCHAR(15) NOT NULL,
    branch_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (phone_number),
    FOREIGN KEY (branch_name) REFERENCES branch(branch_name)
);

CREATE TABLE `branch_fax_number` (
	fax_number VARCHAR(15) NOT NULL,
    branch_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (fax_number),
    FOREIGN KEY (branch_name) REFERENCES branch(branch_name)
);

CREATE TABLE `customer_phone_number` (
	phone_number VARCHAR(15) NOT NULL,
    customer_id INT NOT NULL,
    PRIMARY KEY (phone_number),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE `employee_phone_number` (
	phone_number VARCHAR(15) NOT NULL,
    employee_id INT NOT NULL,
    PRIMARY KEY (phone_number),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE `account` (
	account_number INT NOT NULL,
    customer_id INT NOT NULL,
    PRIMARY KEY (account_number)
);

CREATE TABLE `savings_account` (
	account_number INT NOT NULL,
    opened_date DATE,
    balance DOUBLE,
    interest_rate FLOAT,
    FOREIGN KEY (account_number) REFERENCES account(account_number)
);

CREATE TABLE `checking_account` (
	account_number INT NOT NULL,
    opened_date DATE,
    balance DOUBLE,
    FOREIGN KEY (account_number) REFERENCES account(account_number)
);

CREATE TABLE `loans_account` (
	account_number INT NOT NULL,
    loan_taken_date DATE,
    balance_due DOUBLE,
    interest_rate FLOAT,
    FOREIGN KEY (account_number) REFERENCES account(account_number)
);

SELECT * FROM employee