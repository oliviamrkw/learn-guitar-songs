<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$apiKey = 'YOUR_API_KEY';

$data = json_decode(file_get_contents('php://input'), true);
$songs = $data['songs'] ?? [];

$response = [
    'youtube_links' => [],
    'thumbnails' => [],
    'tab_links' => []
];

foreach ($songs as $song) {
    $searchUrl = sprintf(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=%s+guitar+lesson&key=%s",
        urlencode($song),
        $apiKey
    );

    $videos = json_decode(file_get_contents($searchUrl), true);
    
    if (!empty($videos['items'])) {
        $firstResult = $videos['items'][0];
        $videoId = $firstResult['id']['videoId'];
        
        $response['youtube_links'][] = "https://www.youtube.com/watch?v=$videoId";
        $response['thumbnails'][] = $firstResult['snippet']['thumbnails']['high']['url'];
    } else {
        $response['youtube_links'][] = null;
        $response['thumbnails'][] = null;
    }

    $response['tab_links'][] = "https://www.ultimate-guitar.com/search.php?search_type=title&value=" . urlencode($song);
}

header('Content-Type: application/json');
echo json_encode($response);
