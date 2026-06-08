$json = [Console]::In.ReadToEnd() | ConvertFrom-Json
$projectRoot = 'C:\Users\n01576099\Development\ign'

$path = $null
if ($json.tool_input.PSObject.Properties['file_path'] -and $json.tool_input.file_path) {
    $path = $json.tool_input.file_path
} elseif ($json.tool_input.PSObject.Properties['path'] -and $json.tool_input.path) {
    $path = $json.tool_input.path
}

if ($path -and [System.IO.Path]::IsPathRooted($path)) {
    $normalizedPath = $path.TrimEnd('\')
    $normalizedRoot = $projectRoot.TrimEnd('\')
    if (-not $normalizedPath.StartsWith($normalizedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-Output '{"continue":false,"stopReason":"Access outside the project root (C:\\Users\\n01576099\\Development\\ign) is restricted."}'
        exit 1
    }
}
