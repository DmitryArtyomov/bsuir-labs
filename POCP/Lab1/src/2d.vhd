library IEEE;
use IEEE.STD_LOGIC_1164.all;

entity \2d\ is
	 port(
		 a : in STD_LOGIC;
		 b : in STD_LOGIC;
		 c : in STD_LOGIC;
		 d : in STD_LOGIC;
		 s : in STD_LOGIC;
		 x : out STD_LOGIC;
		 y : out STD_LOGIC
	     );
end \2d\;
		  
architecture \2d\ of \2d\ is
begin

	x <=a when s='1' else c;
	y <=b when s='1' else d;

end \2d\;
