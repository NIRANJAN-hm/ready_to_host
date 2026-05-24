<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST method is allowed.']);
    exit;
}

function clean_text(string $value): string
{
    $value = trim(strip_tags($value));
    return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
}

function clean_email(string $value): string
{
    $email = filter_var(clean_text($value), FILTER_VALIDATE_EMAIL);
    return $email ?: '';
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

$name = clean_text((string) ($input['name'] ?? ''));
$email = clean_email((string) ($input['email'] ?? ''));
$phone = clean_text((string) ($input['phone'] ?? ''));
$service = clean_text((string) ($input['service'] ?? ''));
$message = clean_text((string) ($input['message'] ?? ''));
$timestamp = clean_text((string) ($input['timestamp'] ?? date('Y-m-d H:i:s')));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required.']);
    exit;
}

$your_whatsapp = '917795444954';
$callmebot_api_key = getenv('CALLMEBOT_API_KEY') ?: '';

$whatsapp_message = "NEW WEBSITE INQUIRY\n\n";
$whatsapp_message .= "CUSTOMER DETAILS:\n";
$whatsapp_message .= "Name: $name\n";
$whatsapp_message .= "Email: $email\n";
$whatsapp_message .= "Phone: $phone\n";
$whatsapp_message .= "Service: $service\n\n";
$whatsapp_message .= "PROJECT DETAILS:\n$message\n\n";
$whatsapp_message .= "Time: $timestamp\n";
$whatsapp_message .= "Source: Website Contact Form\n\n";
$whatsapp_message .= "Please contact this customer.";

if ($callmebot_api_key !== '' && function_exists('curl_init')) {
    $callmebot_url = 'https://api.callmebot.com/whatsapp.php?phone=' . rawurlencode($your_whatsapp)
        . '&text=' . rawurlencode($whatsapp_message)
        . '&apikey=' . rawurlencode($callmebot_api_key);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $callmebot_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_exec($ch);
    $callmebot_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($callmebot_http_code === 200) {
        echo json_encode(['success' => true, 'method' => 'CallMeBot', 'message' => 'WhatsApp message sent successfully.']);
        exit;
    }
}

$to = 'sriguruconstruction555@gmail.com';
$subject = 'Urgent website inquiry - ' . ($service ?: 'General');
$email_body = "URGENT CUSTOMER INQUIRY\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n";
$email_body .= "Service: $service\n";
$email_body .= "Message: $message\n";
$email_body .= "Time: $timestamp\n\n";
$email_body .= "Reply on WhatsApp: https://wa.me/" . preg_replace('/\D+/', '', $phone);

$domain = preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'sriguruconstruction.com');
$from = 'website@' . ($domain ?: 'sriguruconstruction.com');
$headers = [
    'From: SRI GURU Website <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Priority: 1',
];

if (mail($to, $subject, $email_body, implode("\r\n", $headers))) {
    echo json_encode([
        'success' => true,
        'method' => $callmebot_api_key !== '' ? 'Email Fallback' : 'Email Notification',
        'message' => 'Website inquiry notification sent successfully.'
    ]);
    exit;
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'message' => 'Notification could not be sent. Please verify PHP mail support or configure CALLMEBOT_API_KEY.'
]);
