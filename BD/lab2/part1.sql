USE AdventureWorks2012;
GO

SELECT e.BusinessEntityID, e.OrganizationLevel, e.JobTitle, jc.JobCandidateID, jc.Resume FROM HumanResources.Employee e
INNER JOIN HumanResources.JobCandidate jc ON e.BusinessEntityID = jc.BusinessEntityID;
GO

SELECT d.DepartmentID, d.Name, COUNT(*) as EmpCount FROM HumanResources.Department d
INNER JOIN HumanResources.EmployeeDepartmentHistory edh ON edh.DepartmentID = d.DepartmentID
WHERE edh.EndDate IS NULL
GROUP BY d.DepartmentID, d.name
HAVING COUNT(*) > 10;
GO

SELECT d.Name, e.HireDate, e.SickLeaveHours, SUM(e.SickLeaveHours) OVER(PARTITION BY d.Name ORDER BY e.HireDate) AS AccumulativeSum FROM HumanResources.Employee e
INNER JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
INNER JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
WHERE edh.EndDate IS NULL
ORDER BY d.name, e.HireDate;
GO