USE bank_database;

DELIMITER $	

-- Register user
DROP PROCEDURE RegisterUser;
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
END$

-- Login
DROP FUNCTION LoginUser;
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
        'userId', UserID,
        'username', Username,
        'role', Role,
        'customerCode', IFNULL(CustomerCode, 'NULL')
    )
    INTO user_info
    FROM User
    WHERE Username = p_Username AND PasswordHash = SHA2(p_Password, 256);

    -- Return user information or a JSON-like error message
    RETURN COALESCE(user_info, JSON_OBJECT('error', 'Invalid username or password'));
END$

-- generate new customer code
DROP FUNCTION GenerateCustomerCode;
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
END$

-- Create new customer
DROP PROCEDURE AddCustome
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
END$

-- Function to create account
DROP PROCEDURE AddNewAccount;
CREATE PROCEDURE AddNewAccount(
    IN account_number CHAR(10),
    IN customer_code VARCHAR(10),
    IN account_type ENUM('Savings', 'Checking', 'Loan'),
    IN balance DECIMAL(15, 2),
    IN interest_rate DECIMAL(5, 2),
    IN open_date DATE,
    IN loan_take_date DATE
)
BEGIN
    -- Add the account to the main Account table
    INSERT INTO Account (AccountNumber, CustomerCode, AccountType)
    VALUES (account_number, customer_code, account_type);

    -- Insert details into the respective account-specific table
    CASE 
        WHEN account_type = 'Savings' THEN
            INSERT INTO SavingsAccount (AccountNumber, InterestRate, Balance, OpenDate)
            VALUES (account_number, interest_rate, balance, open_date);
        WHEN account_type = 'Checking' THEN
            INSERT INTO CheckingAccount (AccountNumber, Balance, OpenDate)
            VALUES (account_number, balance, open_date);
        WHEN account_type = 'Loan' THEN
            INSERT INTO LoanAccount (AccountNumber, LoanTakeDate, BalanceDue, InterestRate)
            VALUES (account_number, loan_take_date, balance, interest_rate);
    END CASE;
END$

-- Function to Calculate Total Balance for Each Account Type of a Customer
DROP FUNCTION CalculateTotalBalanceByCustomer;
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
END$

-- Procedure to Sort Employees by Decreasing Number of Customers They Serve in a Period
DROP PROCEDURE SortEmployeesByCustomers;
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
END$

DELIMITER ;