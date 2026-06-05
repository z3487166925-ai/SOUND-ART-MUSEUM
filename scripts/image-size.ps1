Add-Type -AssemblyName System.Drawing
$assets = "C:\Users\ZHANG\.cursor\projects\e\assets"
Get-ChildItem $assets -Filter "ChatGPT_Image_2026_6_6*" | ForEach-Object {
  $i = [System.Drawing.Image]::FromFile($_.FullName)
  Write-Output "$($_.Name) $($i.Width)x$($i.Height)"
  $i.Dispose()
}
