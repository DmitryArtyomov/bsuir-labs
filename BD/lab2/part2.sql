-- Variant 8

USE NewDatabase
GO

CREATE TABLE dbo.Address(
	[AddressID] [int] NOT NULL,
	[AddressLine1] [nvarchar](60) NOT NULL,
	[AddressLine2] [nvarchar](60) NULL,
	[City] [nvarchar](30) NOT NULL,
	[StateProvinceID] [int] NOT NULL,
	[PostalCode] [nvarchar](15) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL CONSTRAINT [DF_Address_ModifiedDate]  DEFAULT (getdate()));
GO

ALTER TABLE dbo.Address
	ADD [ID] [int] IDENTITY(1,1) UNIQUE;
GO

ALTER TABLE dbo.Address
	ADD CONSTRAINT odd_check_state_province_id CHECK (StateProvinceID % 2 = 1);
GO

ALTER TABLE dbo.Address
	ADD CONSTRAINT df_address_line_2 DEFAULT 'Unknown' for AddressLine2;
GO

INSERT INTO dbo.Address (AddressID, AddressLine1, City, StateProvinceID, PostalCode)
SELECT a.AddressID, a.AddressLine1, a.City, a.StateProvinceID, a.PostalCode FROM AdventureWorks2012.Person.Address a
INNER JOIN AdventureWorks2012.Person.StateProvince sp ON sp.StateProvinceID = a.StateProvinceID
INNER JOIN AdventureWorks2012.Person.CountryRegion cr ON cr.CountryRegionCode = sp.CountryRegionCode
WHERE cr.Name LIKE 'a%' AND a.StateProvinceID % 2 = 1;

ALTER TABLE dbo.Address
	ALTER COLUMN AddressLine2 [nvarchar](60) NOT NULL;
GO

-- This is here to check the result
SELECT a.*, cr.Name as CountryRegionName FROM dbo.Address a
INNER JOIN AdventureWorks2012.Person.StateProvince sp ON sp.StateProvinceID = a.StateProvinceID
INNER JOIN AdventureWorks2012.Person.CountryRegion cr ON cr.CountryRegionCode = sp.CountryRegionCode;
GO

DROP TABLE dbo.Address;
GO
