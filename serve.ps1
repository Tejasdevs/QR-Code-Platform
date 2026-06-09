$port = 8000
$root = Get-Location
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $urlPath = $request.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }

        $filePath = Join-Path $root $urlPath
        if (-not (Test-Path $filePath) -or (Get-Item $filePath).PSIsContainer) {
            $context.Response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
            $context.Response.Close()
            continue
        }

        $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
        $mimeType = switch ($extension) {
            '.html' {'text/html'}
            '.css' {'text/css'}
            '.js' {'application/javascript'}
            '.json' {'application/json'}
            '.png' {'image/png'}
            '.jpg' {'image/jpeg'}
            '.jpeg' {'image/jpeg'}
            '.svg' {'image/svg+xml'}
            '.ico' {'image/x-icon'}
            default {'application/octet-stream'}
        }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $context.Response.ContentType = $mimeType
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.Close()
    }
} finally {
    if ($listener.IsListening) { $listener.Stop() }
}
