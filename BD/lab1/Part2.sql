-- Variant 8

SELECT BusinessEntityID, BirthDate, MaritalStatus, Gender, HireDate FROM HumanResources.Employee
WHERE BirthDate < '19600101' AND MaritalStatus = 'S';
GO

SELECT BusinessEntityID, JobTitle, BirthDate, Gender, HireDate FROM HumanResources.Employee
WHERE JobTitle = 'Design Engineer'
ORDER BY HireDate DESC;
GO

SELECT BusinessEntityID, DepartmentID, StartDate, EndDate, DATEDIFF(year, StartDate, ISNULL(EndDate, GETDATE())) as YearsWorked FROM HumanResources.EmployeeDepartmentHistory
WHERE DepartmentID = 1;
GO