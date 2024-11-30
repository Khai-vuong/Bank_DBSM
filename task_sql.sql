-- Search customer information: Search results include the name, phone number and information about his/her account.
SELECT c.CustomerCode, c.FirstName, c.LastName, cpn.PhoneNumberList, a.AccountNumberList
FROM customer AS c
LEFT JOIN (
    SELECT CustomerCode, GROUP_CONCAT(JSON_ARRAY(PhoneNumber)) AS PhoneNumberList
    FROM customerphonenumber
    GROUP BY CustomerCode
) AS cpn ON c.CustomerCode = cpn.CustomerCode
LEFT JOIN (
    SELECT CustomerCode, GROUP_CONCAT(JSON_ARRAY(AccountNumber)) AS AccountNumberList
    FROM account
    GROUP BY CustomerCode
) AS a ON c.CustomerCode = a.CustomerCode
WHERE CONCAT(c.FirstName, ' ', c.LastName) LIKE '%Alice%';

-- 
SELECT c.CustomerCode, c.FirstName, c.LastName, cpn.PhoneNumberList, a.AccountList
FROM customer AS c
LEFT JOIN (
    SELECT CustomerCode, GROUP_CONCAT(PhoneNumber) AS PhoneNumberList
    FROM customerphonenumber
    GROUP BY CustomerCode
) AS cpn ON c.CustomerCode = cpn.CustomerCode
LEFT JOIN (
    SELECT acc.CustomerCode, JSON_OBJECTAGG(acc_d.AccountNumber, AccountInformation) AS AccountList
    FROM account AS acc
    JOIN (
        SELECT AccountNumber, CONCAT(BalanceDue, ',', InterestRate, ',', LoanTakeDate) AS AccountInformation
        FROM loanaccount
        UNION
        SELECT AccountNumber, CONCAT(Balance, ',', InterestRate) AS AccountInformation
        FROM savingsaccount
        UNION
        SELECT AccountNumber, CONCAT(Balance, ',', OpenDate) AS AccountInformation
        FROM checkingaccount
    ) AS acc_d
    ON acc.AccountNumber = acc_d.AccountNumber
    GROUP BY CustomerCode
) AS a ON c.CustomerCode = a.CustomerCode;

-- Select all account information of the customer name ?
SELECT 
	c.FirstName,
    c.LastName,
    a.AccountNumber, 
    a.AccountType, 
    CASE 
        WHEN a.AccountType = 'Savings' THEN sa.Balance
        WHEN a.AccountType = 'Checking' THEN ca.Balance
        WHEN a.AccountType = 'Loan' THEN la.BalanceDue
    END AS Balance,
    CASE 
        WHEN a.AccountType = 'Savings' THEN sa.InterestRate
        WHEN a.AccountType = 'Loan' THEN la.InterestRate
    END AS InterestRate,
    sa.OpenDate AS SavingsOpenDate,
    ca.OpenDate AS CheckingOpenDate,
    la.LoanTakeDate AS LoanTakeDate
FROM 
    Customer c
INNER JOIN 
    Account a ON c.CustomerCode = a.CustomerCode
LEFT JOIN 
    SavingsAccount sa ON a.AccountNumber = sa.AccountNumber
LEFT JOIN 
    CheckingAccount ca ON a.AccountNumber = ca.AccountNumber
LEFT JOIN 
    LoanAccount la ON a.AccountNumber = la.AccountNumber
WHERE 
    CONCAT(c.FirstName, ' ', c.LastName) LIKE '%A%';
    
-- Decrease interest rate to 10% for all savings accounts whose opening date is from 01/09/2020
UPDATE SavingsAccount
SET InterestRate = 10.00
WHERE OpenDate >= '2020-09-01';

-- Calculate Total Balance for Each Account Type of a Customer
SELECT CalculateTotalBalanceByCustomer('C001') AS TotalBalance;


CALL SortEmployeesByCustomers('2022-01-01', '2023-01-01');