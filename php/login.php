<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

include("connection.php");
include("functions.php");


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $password = $_POST["password"];

    // Dummy credentials for demonstration
    $valid_name = "admin";
    $valid_password = "password";

    if ($name === $valid_name && $password === $valid_password) {
        header("Location: ../html/dashboard.html");
        exit;
    } else {
        $error = "Invalid name or password.";
    }
}
?>