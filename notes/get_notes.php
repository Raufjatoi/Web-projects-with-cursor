<?php
$notes = [];
$files = glob('notes/*.json');

foreach ($files as $file) {
    $notes[] = file_get_contents($file);
}

echo json_encode($notes);
?>