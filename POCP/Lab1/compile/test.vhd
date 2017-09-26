-------------------------------------------------------------------------------
--
-- Title       : test
-- Design      : Lab1
-- Author      : Unknown
-- Company     : Unknown
--
-------------------------------------------------------------------------------
--
-- File        : C:\Users\artyo\Documents\ActiveHDL\Labs\Lab1\compile\test.vhd
-- Generated   : Thu Sep 14 18:02:12 2017
-- From        : C:\Users\artyo\Documents\ActiveHDL\Labs\Lab1\src\test.bde
-- By          : Bde2Vhdl ver. 2.6
--
-------------------------------------------------------------------------------
--
-- Description : 
--
-------------------------------------------------------------------------------
-- Design unit header --
library IEEE;
use IEEE.std_logic_1164.all;
use IEEE.std_logic_arith.all;
use IEEE.std_logic_signed.all;
use IEEE.std_logic_unsigned.all;


entity test is
  port(
       in1 : in STD_LOGIC;
       in2 : in STD_LOGIC;
       in3 : in STD_LOGIC;
       Q : out STD_LOGIC;
       nQ : out STD_LOGIC
  );
end test;

architecture test of test is

---- Signal declarations used on the diagram ----

signal NET115 : STD_LOGIC;
signal NET121 : STD_LOGIC;
signal NET53 : STD_LOGIC;

begin

----  Component instantiations  ----

NET115 <= NET53 and in1;

NET121 <= not(NET53) and in3;

Q <= NET121 or NET115;


---- Terminal assignment ----

    -- Inputs terminals
	NET53 <= in2;


end test;
