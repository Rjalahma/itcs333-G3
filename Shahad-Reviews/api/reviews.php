<?php
header("Content-Type: application/json");
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET':
    if (isset($_GET['id'])) {
      $stmt = $pdo->prepare("SELECT * FROM reviews WHERE id = ?");
      $stmt->execute([$_GET['id']]);
      echo json_encode($stmt->fetch());
    } else {
      $stmt = $pdo->query("SELECT * FROM reviews");
      echo json_encode($stmt->fetchAll());
    }
    break;

  case 'POST':
    $data = json_decode(file_get_contents("php://input"), true);
    if (validate($data)) {
      $stmt = $pdo->prepare("INSERT INTO reviews (courseName, reviewText, reviewerName, rating, department, date) VALUES (?, ?, ?, ?, ?, ?)");
      $stmt->execute([
        $data['courseName'],
        $data['reviewText'],
        $data['reviewerName'],
        $data['rating'],
        $data['department'],
        $data['date']
      ]);
      echo json_encode(['success' => true]);
    } else {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid input']);
    }
    break;

  case 'PUT':
    parse_str(file_get_contents("php://input"), $data);
    if (validate($data) && isset($data['id'])) {
      $stmt = $pdo->prepare("UPDATE reviews SET courseName = ?, reviewText = ?, reviewerName = ?, rating = ?, department = ?, date = ? WHERE id = ?");
      $stmt->execute([
        $data['courseName'],
        $data['reviewText'],
        $data['reviewerName'],
        $data['rating'],
        $data['department'],
        $data['date'],
        $data['id']
      ]);
      echo json_encode(['success' => true]);
    } else {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid input or missing ID']);
    }
    break;

  case 'DELETE':
    parse_str(file_get_contents("php://input"), $data);
    if (isset($data['id'])) {
      $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
      $stmt->execute([$data['id']]);
      echo json_encode(['success' => true]);
    } else {
      http_response_code(400);
      echo json_encode(['error'  => 'ID is required']);
    }
    break;
}

function validate($data) {
  return isset($data['courseName'], $data['reviewText'], $data['reviewerName'], $data['rating'], $data['department'], $data['date']) &&
         is_numeric($data['rating']) && $data['rating'] >= 1 && $data['rating'] <= 5;
}
?>
