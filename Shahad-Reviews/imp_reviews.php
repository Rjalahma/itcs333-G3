<?php
$host = 'localhost';
$db   = 'Shahad_coursereviews'; // your actual DB name
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  die("DB Connection failed: " . $e->getMessage());
}

$jsonFile = 'reviews.json';
if (!file_exists($jsonFile)) {
  die("reviews.json file not found.");
}

$jsonData = file_get_contents($jsonFile);
$reviews = json_decode($jsonData, true);

if (!$reviews || !is_array($reviews)) {
  die("Invalid JSON format.");
}

$stmt = $pdo->prepare("INSERT INTO reviews (id, courseName, reviewText, reviewerName, rating, department, date) VALUES (?, ?, ?, ?, ?, ?, ?)");

foreach ($reviews as $review) {
  $stmt->execute([
    $review['id'],
    $review['courseName'],
    $review['reviewText'],
    $review['reviewerName'],
    $review['rating'],
    $review['department'],
    $review['date']
  ]);
}

echo "All reviews imported successfully !";
?>
