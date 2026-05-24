<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=UTF-8');

$receiving_email_address = 'sriguruconstruction555@gmail.com';

function clean_text(string $value): string
{
    $value = trim(strip_tags($value));
    return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
}

function field_value(string $key): string
{
    return isset($_POST[$key]) ? clean_text((string) $_POST[$key]) : '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Only POST requests are allowed.';
    exit;
}

$name = field_value('name');
$email = filter_var(field_value('email'), FILTER_VALIDATE_EMAIL) ?: '';
$phone = field_value('phone');
$message = field_value('message');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo 'Please provide a valid name, email address, and message.';
    exit;
}

$body_lines = [
    'New quote request from the SRI GURU CONSTRUCTION & INTERIORS website.',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . ($phone ?: 'Not provided'),
    '',
    'Message:',
    $message,
    '',
    'Submitted from: ' . ($_SERVER['HTTP_HOST'] ?? 'website'),
    'Submitted at: ' . date('Y-m-d H:i:s'),
];

$domain = preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? 'sriguruconstruction.com');
$from = 'website@' . ($domain ?: 'sriguruconstruction.com');

$headers = [
    'From: SRI GURU Website <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    $receiving_email_address,
    'Request for a quote',
    implode("\n", $body_lines),
    implode("\r\n", $headers)
);

if ($sent) {
    echo 'OK';
    exit;
}

http_response_code(500);
echo 'Unable to send your quote request right now. Please call +91 7795 444 954 or email sriguruconstruction555@gmail.com.';
