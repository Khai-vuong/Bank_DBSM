DROP DATABASE IF EXISTS bank_database;
CREATE DATABASE bank_database;

USE bank_database;

-- customer
CREATE TABLE Customer
(
	CustomerCode				VARCHAR(10)					PRIMARY KEY,
    FirstName					VARCHAR(30)					NOT NULL,
    LastName					VARCHAR(30)					NOT NULL,
    HomeAddress					VARCHAR(255)				NOT NULL,
    OfficeAddress				VARCHAR(255),
    Email						VARCHAR(100)	 			NOT NULL UNIQUE CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    ServeEmployeeCode			VARCHAR(10),
    ServeDate					DATE
);

DELIMITER //
CREATE TRIGGER served_date
BEFORE INSERT ON Customer
FOR EACH ROW
BEGIN
    IF NEW.ServeDate IS NULL THEN
        SET NEW.ServeDate = CURDATE();
    END IF;

    IF NEW.ServeDate > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ngày phục vụ không thể lớn hơn ngày hiện tại.';
    END IF;
END; //
DELIMITER ;

CREATE TABLE CustomerPhoneNumber
(
	PhoneNumber					VARCHAR(20)					NOT NULL CHECK (LENGTH(PhoneNumber) > 0 AND LENGTH(phoneNumber) <= 11 AND (PhoneNumber REGEXP '^[0-9]+$')),
    CustomerCode				VARCHAR(10),
    PRIMARY KEY (PhoneNumber, CustomerCode),
    FOREIGN KEY (CustomerCode) REFERENCES Customer(CustomerCode) ON DELETE CASCADE
);

-- Account
CREATE TABLE Account
(
    AccountCode                 VARCHAR(10)                             PRIMARY KEY,
	AccountNumber				CHAR(10)								UNIQUE,
    CustomerCode				VARCHAR(10),
    AccountType					ENUM('Checking', 'Savings', 'Loan')		NOT NULL,
    FOREIGN KEY (CustomerCode) REFERENCES Customer(CustomerCode),
    CONSTRAINT check_type CHECK (AccountType IN ('Checking', 'Savings', 'Loan' ))
);

-- Savings Account
CREATE TABLE SavingsAccount
(
	AccountCode				    VARCHAR(10)					PRIMARY KEY,
    InterestRate				DECIMAL(5, 2)				NOT NULL CHECK (InterestRate >= 0),
    Balance						DECIMAL(15, 2)				NOT NULL CHECK (Balance >= 0),
    OpenDate					DATE 						NOT NULL,
    FOREIGN KEY (AccountCode) REFERENCES Account(AccountCode) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER savingsaccount_open_date
BEFORE INSERT ON SavingsAccount
FOR EACH ROW
BEGIN
    IF NEW.OpenDate IS NULL THEN
        SET NEW.openDate = CURDATE();
    END IF;

    IF NEW.OpenDate > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ngày tạo tài khoản không thể lớn hơn ngày hiện tại.';
    END IF;
END;
//
DELIMITER ;

-- Checking Account
CREATE TABLE CheckingAccount
(
	AccountCode				    VARCHAR(10)					PRIMARY KEY,
    Balance						DECIMAL(15, 2)				NOT NULL CHECK (Balance >= 0),
    OpenDate					DATE 						NOT NULL,
    FOREIGN KEY (AccountCode) REFERENCES Account(AccountCode) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER checkingaccount_open_date
BEFORE INSERT ON CheckingAccount
FOR EACH ROW
BEGIN
    IF NEW.OpenDate IS NULL THEN
        SET NEW.openDate = CURDATE();
    END IF;

    IF NEW.OpenDate > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ngày tạo tài khoản không thể lớn hơn ngày hiện tại.';
    END IF;
END;
//
DELIMITER ;

-- Loan Account
CREATE TABLE LoanAccount
(
	AccountCode				    VARCHAR(10)					PRIMARY KEY,
    LoanTakeDate				DATE 						NOT NULL,
    BalanceDue					DECIMAL(15, 2)				NOT NULL,
    InterestRate				DECIMAL(5, 2)				NOT NULL CHECK (InterestRate >= 0),
    FOREIGN KEY (AccountCode) REFERENCES Account(AccountCode) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER account_loan_taken_date
BEFORE INSERT ON LoanAccount
FOR EACH ROW
BEGIN
	IF NEW.LoanTakeDate IS NULL THEN
        SET NEW.LoanTakeDate = CURDATE();
    END IF;

    IF NEW.LoanTakeDate > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Ngày nhận khoản vay không thể lớn hơn ngày hiện tại.';
    END IF;
END;
//
DELIMITER ;

-- Tạm thời tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Branch
CREATE TABLE Branch
(
	BranchName					VARCHAR(100)				PRIMARY KEY,
    AddressNo					VARCHAR(10)					NOT NULL,
    AddressStreet 				VARCHAR(255) 				NOT NULL, 
    AddressDistrict 			VARCHAR(255) 				NOT NULL, 
    AddressCity 				VARCHAR(255) 				NOT NULL, 
    AddressRegion 				VARCHAR(255) 				NOT NULL,
    Email						VARCHAR(100)				NOT NULL UNIQUE CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    ManagerCode					VARCHAR(10)					NOT NULL
); 

-- Employee
CREATE TABLE Employee
(
	EmployeeCode				VARCHAR(10)					PRIMARY KEY,
    FirstName					VARCHAR(30)					NOT NULL,
    LastName					VARCHAR(30)					NOT NULL,
    BirthDate					DATE 						NOT NULL,
    HomeAddressNo 				VARCHAR(10) 				NOT NULL, 
    HomeAddressStreet 			VARCHAR(100) 				NOT NULL, 
    HomeAddressDistrict 		VARCHAR(100) 				NOT NULL, 
    HomeAddressCity 			VARCHAR(100) 				NOT NULL,
    Email						VARCHAR(100)				NOT NULL UNIQUE CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    BranchName					VARCHAR(100)				NOT NULL,
    FOREIGN KEY (BranchName) REFERENCES Branch(BranchName)
);

DELIMITER //
CREATE TRIGGER emp_age_insert
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
	IF (DATEDIFF(CURDATE(), NEW.BirthDate) < 6574) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nhân viên phải từ 18 tuổi trở lên';
    END IF;
END; //

CREATE TRIGGER emp_age_update
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
	IF (DATEDIFF(CURDATE(), NEW.BirthDate) < 6574) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nhân viên phải từ 18 tuổi trở lên';
    END IF;
END; //

CREATE TRIGGER check_date
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
	IF NEW.BirthDate > CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày sinh không thể lớn hơn ngày hiện tại';
	END IF;
END; //

DELIMITER ;

ALTER TABLE Customer
ADD CONSTRAINT FK_Serve_Customer FOREIGN KEY (ServeEmployeeCode) REFERENCES Employee(EmployeeCode);

ALTER TABLE Branch
ADD CONSTRAINT FK_Branch_Employee FOREIGN KEY (ManagerCode) REFERENCES Employee(EmployeeCode);

CREATE TABLE BranchPhone
(
	BranchName					VARCHAR(100)				NOT NULL,
    PhoneNumber					CHAR(11)					NOT NULL CHECK (LENGTH(PhoneNumber) > 0 AND LENGTH(phoneNumber) <= 11 AND (PhoneNumber REGEXP '^[0-9]+$')),
    PRIMARY KEY (BranchName, PhoneNumber),
    FOREIGN KEY (BranchName) REFERENCES Branch(BranchName) ON DELETE CASCADE
);

CREATE TABLE BranchFax
(
	BranchName					VARCHAR(100)				NOT NULL ,
    FaxNumber					CHAR(11)					NOT NULL CHECK (LENGTH(FaxNumber) > 0 AND LENGTH(FaxNumber) <= 11 AND (FaxNumber REGEXP '^[0-9]+$')),
	PRIMARY KEY (BranchName, FaxNumber),
    FOREIGN KEY (BranchName) REFERENCES Branch(BranchName) ON DELETE CASCADE
);

CREATE TABLE EmployeePhone
(
	EmployeeCode				VARCHAR(10)					NOT NULL,
    PhoneNumber					CHAR(11)					NOT NULL CHECK (LENGTH(PhoneNumber) > 0 AND LENGTH(phoneNumber) <= 11 AND (PhoneNumber REGEXP '^[0-9]+$')),
	PRIMARY KEY (EmployeeCode, PhoneNumber),
    FOREIGN KEY (EmployeeCode) REFERENCES Employee(EmployeeCode) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- Khởi tạo một vài giá trị ban đầu để tránh lỗi tham chiếu khoá ngoại
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO Employee
(
	EmployeeCode,
    FirstName,
    LastName,
    BirthDate,
    HomeAddressNo, 
    HomeAddressStreet, 
    HomeAddressDistrict, 
    HomeAddressCity,
    Email,
    BranchName
)
VALUES
	('E001', 'John', 'Doe', '1980-01-01', '123', 'Main St', 'Downtown', 'Metropolis', 'john.doe@example.com', 'Central Branch'), 
	('E002', 'Jane', 'Smith', '1985-02-02', '456', 'Second St', 'Uptown', 'Metropolis', 'jane.smith@example.com', 'North Branch'), 
	('E003', 'Alice', 'Johnson', '1990-03-03', '789', 'Third St', 'Suburbia', 'Metropolis', 'alice.johnson@example.com', 'Central Branch'), 
	('E004', 'Bob', 'Brown', '1975-04-04', '101', 'Fourth Ave', 'Countryside', 'Metropolis', 'bob.brown@example.com', 'North Branch');

INSERT INTO EmployeePhone 
(
	EmployeeCode, 
	PhoneNumber
) 
VALUES 
	('E001', '0123456789'), 
	('E002', '2345678901'), 
	('E003', '3456789012'), 
	('E004', '4567890123');

INSERT INTO Branch 
(
	BranchName, 
	AddressNo, 
	AddressStreet, 
	AddressDistrict, 
	AddressCity, 
	AddressRegion, 
	Email, 
	ManagerCode
) 
VALUES 
('Central Branch', '123', 'Main St', 'Downtown', 'Metropolis', 'North', 'central@abcbank.com', 'E001'), 
('North Branch', '456', 'Second St', 'Uptown', 'Metropolis', 'North', 'north@abcbank.com', 'E002'), 
('South Branch', '789', 'Third St', 'Southtown', 'Metropolis', 'South', 'south@abcbank.com', 'E003'), 
('East Branch', '101', 'Fourth St', 'Eastside', 'Metropolis', 'East', 'east@abcbank.com', 'E004');

INSERT INTO BranchPhone (BranchName, PhoneNumber)
VALUES 
('Central Branch', '0123456789'),
('North Branch', '0987654321'),
('South Branch', '2345678901'),
('East Branch', '1098765432');

INSERT INTO BranchFax (BranchName, FaxNumber)
VALUES 
('Central Branch', '0123456789'),
('North Branch', '0987654321'),
('South Branch', '2345678901'),
('East Branch', '1098765432');

INSERT INTO Customer (CustomerCode, FirstName, LastName, HomeAddress, OfficeAddress, Email, ServeEmployeeCode, ServeDate)
VALUES 
('C001', 'Alice', 'Johnson', '123 Elm St, Springfield', '456 Oak St, Springfield', 'alice.johnson@example.com', "E001", '2024-06-12'),
('C002', 'Bob', 'Smith', '789 Pine St, Springfield', '101 Maple St, Springfield', 'bob.smith@example.com', "E002", '2024-07-16'),
('C003', 'Carol', 'Williams', '234 Cedar St, Springfield', '567 Birch St, Springfield', 'carol.williams@example.com', "E001", '2024-06-22'),
('C004', 'David', 'Brown', '890 Fir St, Springfield', NULL, 'david.brown@example.com', "E004", '2024-05-12');

INSERT INTO CustomerPhoneNumber (PhoneNumber, CustomerCode)
VALUES 
('5678901234', 'C001'),
('6789012345', 'C002'),
('7890123456', 'C003'),
('8901234567', 'C004'),
('8901234561', 'C001');

INSERT INTO Account (AccountCode, AccountNumber, CustomerCode, AccountType)
VALUES 
('A001', '0912567145', 'C001', 'Savings'),
('A002', '1182175123', 'C002', 'Checking'),
('A003', '2819981341', 'C003', 'Loan'),
('A004', '0198411231', 'C004', 'Savings'),
('A005', '7183913191', 'C001', 'Checking');

INSERT INTO CheckingAccount (AccountCode, Balance, OpenDate)
VALUES 
('A002', 5000.00, '2022-01-10'),
('A005', 4000.00, '2022-01-10');

INSERT INTO SavingsAccount (AccountCode, InterestRate, Balance, OpenDate)
VALUES 
('A001', 1.5, 2000.00, '2022-01-15'),
('A004', 2.0, 3000.00, '2022-02-20');

INSERT INTO LoanAccount (AccountCode, LoanTakeDate, BalanceDue, InterestRate)
VALUES 
('A003', '2022-03-10', 15000.00, 3.5);

CREATE TABLE User (
    UserCode VARCHAR(10) PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, -- Store hashed passwords for security
    Role ENUM('Customer', 'Manager') NOT NULL,
    CustomerCode VARCHAR(10), -- NULL for managers
    FOREIGN KEY (CustomerCode) REFERENCES Customer(CustomerCode) ON DELETE SET NULL
);

SET GLOBAL log_bin_trust_function_creators = 1;