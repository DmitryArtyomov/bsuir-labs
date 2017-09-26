library IEEE;
use IEEE.STD_LOGIC_1164.all;

entity mux is
	 port(
		 a, b, s : in STD_LOGIC;
		 z : out STD_LOGIC
	     );
end mux;

architecture beh of mux is
begin
	z <= a when s='0' else b;
end beh;
