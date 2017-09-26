library IEEE;
use IEEE.STD_LOGIC_1164.all;

entity \2c\ is
	 port(
		 in1 : in STD_LOGIC;
		 in2 : in STD_LOGIC;
		 in3 : in STD_LOGIC;
		 Q : out STD_LOGIC;
		 nQ : out STD_LOGIC
	     );
end \2c\;	  	

architecture \2c\ of \2c\ is
begin		  
	process (in1, in2, in3)
	variable output : STD_LOGIC;
	begin				   
		output := (in1 and in2) or (in3 and not in2);  
		Q <= output;
		nQ <= not output;
	end process;
end \2c\;
