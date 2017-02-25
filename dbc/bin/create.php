<?php
	include "../lib/mMysql.php";
	
	$db = new Database();
	$db->CreateDB();
	$db->CreateTB();
	
	echo "Complete!";

?>