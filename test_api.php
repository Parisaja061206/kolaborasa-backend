<?php
$ch = curl_init('http://localhost/kolaborasa-backend/backend/index.php/Auth/updateProfile');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['id_user'=>1, 'nama'=>'Test', 'email'=>'test@test.com', 'password'=>'']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
echo curl_exec($ch);
?>
