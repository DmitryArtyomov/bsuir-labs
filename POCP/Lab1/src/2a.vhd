library IEEE;
use IEEE.STD_LOGIC_1164.all;

entity or4 is
	 port(
		 a : in STD_LOGIC;
		 b : in STD_LOGIC;
		 c : in STD_LOGIC;
		 d : in STD_LOGIC;
		 z : out STD_LOGIC
	     );
end or4;
   
architecture or4 of or4 is
begin				   			  
	z <= a or b or c or d;
end or4;
