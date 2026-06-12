<?php
$mysqli = new mysqli('localhost', 'root', '', 'db_kolaborasa');
if ($mysqli->connect_error) {
    die('Connect Error: ' . $mysqli->connect_error);
}

echo "=== TABLES ===\n";
$res = $mysqli->query('SHOW TABLES');
$tables = [];
if ($res) {
    while($row = $res->fetch_row()) {
        $tables[] = $row[0];
        echo $row[0] . "\n";
    }
}

foreach (['user', 'ide'] as $table) {
    echo "\n=== DESCRIBE $table ===\n";
    $res = $mysqli->query("DESCRIBE $table");
    if ($res) {
        while($row = $res->fetch_assoc()) {
            echo "{$row['Field']} - {$row['Type']} (Null: {$row['Null']}, Default: {$row['Default']})\n";
        }
    } else {
        echo "Table $table might not exist or error: " . $mysqli->error . "\n";
    }
}

$mysqli->close();
?>