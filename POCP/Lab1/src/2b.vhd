library IEEE;
use IEEE.STD_LOGIC_1164.all;

entity \2b\ is
	 port(
		 in1 : in STD_LOGIC;
		 in2 : in STD_LOGIC;
		 in3 : in STD_LOGIC;
		 Q : out STD_LOGIC
	     );
end \2b\;

architecture \2b\ of \2b\ is
begin
	Q <= (in1 and in2) or (in3 and not in2);
end \2b\;
