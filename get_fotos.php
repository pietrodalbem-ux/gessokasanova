<?php
header('Content-Type: application/json');

$dir = 'fotos/';
$fotos = [];

if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $fotos[] = $dir . $file;
        }
    }
}

echo json_encode($fotos);
?>
