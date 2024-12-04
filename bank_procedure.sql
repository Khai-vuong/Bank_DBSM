USE bank_database;

DELIMITER $$
-- Register user
DROP PROCEDURE IF EXISTS RegisterUser;
CREATE PROCEDURE RegisterUser(
    IN p_Username VARCHAR(50), 
    IN p_Password VARCHAR(50), 
    IN p_Role ENUM('Customer', 'Manager'), 
    IN p_CustomerCode VARCHAR(10)
)
BEGIN
    -- Validate if the username already exists
    IF EXISTS (SELECT 1 FROM User WHERE Username = p_Username) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Username already exists.';
    END IF;

    -- Validate CustomerCode for Customer role
    IF p_Role = 'Customer' AND 
       NOT EXISTS (SELECT 1 FROM Customer WHERE CustomerCode = p_CustomerCode) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Invalid CustomerCode for Customer role.';
    END IF;

    -- Insert the new user
    INSERT INTO User (Username, PasswordHash, Role, CustomerCode)
    VALUES (
        p_Username, 
        SHA2(p_Password, 256), -- Hash the password
        p_Role, 
        IF(p_Role = 'Manager', NULL, p_CustomerCode) -- CustomerCode is NULL for Managers
    );
END; $$

-- Login
DROP FUNCTION IF EXISTS LoginUser;
CREATE FUNCTION LoginUser(
    p_Username VARCHAR(50), 
    p_Password VARCHAR(50)
)
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE user_info TEXT;

    -- Verify credentials and construct a JSON-like string
    SELECT JSON_OBJECT(
        'UserCode', UserCode,
        'UserName', Username,
        'Role', Role,
        'CustomerCode', IFNULL(CustomerCode, 'NULL')
    )
    INTO user_info
    FROM User
    WHERE Username = p_Username AND PasswordHash = p_Password;

    -- Return user information or a JSON-like error message
    RETURN COALESCE(user_info, JSON_OBJECT('error', 'Invalid username or password'));
END; $$

-- generate new customer code
DROP FUNCTION IF EXISTS GenerateCustomerCode;
CREATE FUNCTION GenerateCustomerCode()
RETURNS VARCHAR(10)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE new_code VARCHAR(10);
    DECLARE max_code INT;

    -- Extract the maximum numerical part of the existing CustomerCode
    SELECT IFNULL(MAX(CAST(SUBSTRING(CustomerCode, 2) AS UNSIGNED)), 0) INTO max_code
    FROM Customer;

    -- Increment the maximum code by 1 and format it as 'CXXX'
    SET new_code = CONCAT('C', LPAD(max_code + 1, 3, '0'));

    RETURN new_code;
END; $$

-- generate new customer code
DROP FUNCTION IF EXISTS GenerateAccountCode;
CREATE FUNCTION GenerateAccountCode()
RETURNS VARCHAR(10)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE new_code VARCHAR(10);
    DECLARE max_code INT;

    -- Extract the maximum numerical part of the existing CustomerCode
    SELECT IFNULL(MAX(CAST(SUBSTRING(AccountCode, 2) AS UNSIGNED)), 0) INTO max_code
    FROM Account;

    -- Increment the maximum code by 1 and format it as 'CXXX'
    SET new_code = CONCAT('A', LPAD(max_code + 1, 3, '0'));

    RETURN new_code;
END; $$

-- generate new customer code
DROP FUNCTION IF EXISTS GenerateEmployeeCode;
CREATE FUNCTION GenerateEmployeeCode()
RETURNS VARCHAR(10)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE new_code VARCHAR(10);
    DECLARE max_code INT;

    -- Extract the maximum numerical part of the existing CustomerCode
    SELECT IFNULL(MAX(CAST(SUBSTRING(EmployeeCode, 2) AS UNSIGNED)), 0) INTO max_code
    FROM Employee;

    -- Increment the maximum code by 1 and format it as 'CXXX'
    SET new_code = CONCAT('E', LPAD(max_code + 1, 3, '0'));

    RETURN new_code;
END; $$

-- Create new customer
DROP PROCEDURE IF EXISTS AddCustomer;
CREATE PROCEDURE AddCustomer(
    IN p_FirstName VARCHAR(30),
    IN p_LastName VARCHAR(30),
    IN p_HomeAddress VARCHAR(255),
    IN p_OfficeAddress VARCHAR(255),
    IN p_Email VARCHAR(100),
    IN p_Phones TEXT
)
BEGIN
    DECLARE newCustomerCode VARCHAR(10);
    DECLARE phone VARCHAR(20);
    DECLARE pos INT;

    -- Generate a new customer code
    SET newCustomerCode = GenerateCustomerCode();

    -- Insert the new customer into the Customer table
    INSERT INTO Customer (CustomerCode, FirstName, LastName, HomeAddress, OfficeAddress, Email)
    VALUES (newCustomerCode, p_FirstName, p_LastName, p_HomeAddress, p_OfficeAddress, p_Email);

    -- Process the phone numbers (comma-separated)
    WHILE LENGTH(p_Phones) > 0 DO
        -- Find the position of the next comma
        SET pos = LOCATE(',', p_Phones);

        -- Extract the phone number
        IF pos = 0 THEN
            SET phone = p_Phones; -- Last phone number
            SET p_Phones = '';
        ELSE
            SET phone = SUBSTRING(p_Phones, 1, pos - 1);
            SET p_Phones = SUBSTRING(p_Phones, pos + 1);
        END IF;

        -- Insert the phone number into the CustomerPhoneNumber table
        INSERT INTO CustomerPhoneNumber (PhoneNumber, CustomerCode)
        VALUES (phone, newCustomerCode);
    END WHILE;

    -- Return a success message
    SELECT CONCAT('New customer added with CustomerCode: ', newCustomerCode) AS Message;
END; $$

-- Function to create account
DROP FUNCTION IF EXISTS AddNewAccount;
CREATE FUNCTION AddNewAccount(
    account_number CHAR(10),
    customer_code VARCHAR(10),
    account_type ENUM('Savings', 'Checking', 'Loan')
) RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE newAccountCode VARCHAR(10);
    -- Generate a new account code using a hypothetical function GenerateAccountCode
    SET newAccountCode = GenerateAccountCode();
    
    -- Insert the new account into the Account table
    INSERT INTO Account (AccountCode, AccountNumber, CustomerCode, AccountType)
    VALUES (newAccountCode, account_number, customer_code, account_type);
    
    CASE account_type
		WHEN 'Savings' THEN
			INSERT INTO SavingsAccount (AccountCode, InterestRate, Balance, OpenDate)
            VALUES (newAccountCode, 0.0, 0.0, CURDATE());
		WHEN 'Checking' THEN
			INSERT INTO CheckingAccount (AccountCode, Balance, OpenDate)
            VALUES (newAccountCode, 0.0, CURDATE());
		WHEN 'Loan' THEN
			INSERT INTO LoanAccount (AccountCode, InterestRate, BalanceDue, LoanTakeDate)
            VALUES (newAccountCode, 0.0, 0.0, CURDATE());
	END CASE;
    
    -- Return the new account code
    RETURN newAccountCode;
END; $$

DROP FUNCTION IF EXISTS AddNewEmployee;
CREATE FUNCTION AddNewEmployee(
	p_FirstName VARCHAR(30),
	p_LastName VARCHAR(30),
	p_HomeAddressNo VARCHAR(10),
    p_HomeAddressStreet VARCHAR(100),
    p_HomeAddressDistrict VARCHAR(100),
    p_HomeAddressCity VARCHAR(100),
    p_BirthDate DATE,
	p_Email VARCHAR(100),
    p_BranchName VARCHAR(100),
	p_Phones TEXT
) RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE newEmployeeCode VARCHAR(10);
	DECLARE phone VARCHAR(20);
    DECLARE pos INT;
    -- Generate a new Customer code using a hypothetical function GenerateCustomerCode
    SET newEmployeeCode = GenerateEmployeeCode();
    
    INSERT INTO Employee (EmployeeCode, FirstName, LastName, HomeAddressNo, HomeAddressStreet, HomeAddressDistrict, HomeAddressCity, BirthDate, Email, BranchName)
    VALUES (newEmployeeCode, p_FirstName, p_LastName, p_HomeAddressNo, p_HomeAddressStreet, p_HomeAddressDistrict, p_HomeAddressCity, p_BirthDate, p_Email, p_BranchName);
    
    WHILE LENGTH(p_Phones) > 0 DO
        SET pos = LOCATE(',', p_Phones);

        -- Extract the phone number
        IF pos = 0 THEN
            SET phone = p_Phones;
            SET p_Phones = '';
        ELSE
            SET phone = SUBSTRING(p_Phones, 1, pos - 1);
            SET p_Phones = SUBSTRING(p_Phones, pos + 1);
        END IF;

		INSERT INTO EmployeePhone (PhoneNumber, EmployeeCode)
		VALUES (phone, newEmployeeCode);
    END WHILE;
    
    RETURN newEmployeeCode;
END; $$

-- Function to Calculate Total Balance for Each Account Type of a Customer
DROP FUNCTION IF EXISTS CalculateTotalBalanceByCustomer;
CREATE FUNCTION CalculateTotalBalanceByCustomer(customer_id VARCHAR(10))
RETURNS JSON
DETERMINISTIC
BEGIN
    DECLARE total_savings DECIMAL(15, 2) DEFAULT 0.00;
    DECLARE total_checking DECIMAL(15, 2) DEFAULT 0.00;
    DECLARE total_loan DECIMAL(15, 2) DEFAULT 0.00;

    -- Calculate total balances for each account type
    SELECT 
        SUM(Balance) INTO total_savings
    FROM 
        SavingsAccount sa
    INNER JOIN 
        Account a ON sa.AccountNumber = a.AccountNumber
    WHERE 
        a.CustomerCode = customer_id;

    SELECT 
        SUM(Balance) INTO total_checking
    FROM 
        CheckingAccount ca
    INNER JOIN 
        Account a ON ca.AccountNumber = a.AccountNumber
    WHERE 
        a.CustomerCode = customer_id;

    SELECT 
        SUM(BalanceDue) INTO total_loan
    FROM 
        LoanAccount la
    INNER JOIN 
        Account a ON la.AccountNumber = a.AccountNumber
    WHERE 
        a.CustomerCode = customer_id;

    -- Return results as a JSON object
    RETURN JSON_OBJECT(
        'savings', total_savings,
        'checking', total_checking,
        'loan', total_loan
    );
END; $$

-- Procedure to Sort Employees by Decreasing Number of Customers They Serve in a Period
DROP PROCEDURE IF EXISTS SortEmployeesByCustomers;
CREATE PROCEDURE SortEmployeesByCustomers(
    IN start_date DATE, 
    IN end_date DATE
)
BEGIN
    SELECT 
        e.EmployeeCode, 
        CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName, 
        COUNT(c.CustomerCode) AS CustomerCount
    FROM 
        Employee e
    LEFT JOIN 
        Customer c ON e.EmployeeCode = c.ServeEmployeeCode
    WHERE 
        EXISTS (
            SELECT 1
            FROM Account a
            WHERE a.CustomerCode = c.CustomerCode
            AND a.AccountNumber IN (
                SELECT sa.AccountNumber 
                FROM SavingsAccount sa 
                WHERE sa.OpenDate BETWEEN start_date AND end_date
                UNION ALL
                SELECT ca.AccountNumber 
                FROM CheckingAccount ca 
                WHERE ca.OpenDate BETWEEN start_date AND end_date
                UNION ALL
                SELECT la.AccountNumber 
                FROM LoanAccount la 
                WHERE la.LoanTakeDate BETWEEN start_date AND end_date
            )
        )
    GROUP BY 
        e.EmployeeCode
    ORDER BY 
        CustomerCount DESC;
END; $$
DELIMITER ;