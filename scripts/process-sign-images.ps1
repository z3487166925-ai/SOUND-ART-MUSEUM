# 新参考图：金黄 → 纯白，裁切去字，三张统一 960×1200
Add-Type -AssemblyName System.Drawing

$OutW = 960
$OutH = 1200

$assetsDir = "C:\Users\ZHANG\.cursor\projects\e\assets"
$helloSrc = Get-ChildItem $assetsDir -Filter "*ChatGPT_Image_2026_6_6__00_25_42*" | Select-Object -First 1
$tripleSrc = Get-ChildItem $assetsDir -Filter "*ChatGPT_Image_2026_6_6__00_32_05*" | Select-Object -First 1
if (-not $tripleSrc) {
    $tripleSrc = Get-ChildItem $assetsDir -Filter "*ChatGPT_Image_2026_6_6__00_25_56*" | Select-Object -First 1
}

if (-not $tripleSrc) {
    Write-Error "Triple source image not found in $assetsDir"
    exit 1
}
$processHello = (-not ($args -contains "--panels-only")) -and ($null -ne $helloSrc)

function Convert-To32bpp {
    param([System.Drawing.Bitmap]$src)
    if ($src.PixelFormat -eq [System.Drawing.Imaging.PixelFormat]::Format32bppArgb) {
        return $src.Clone()
    }
    $conv = New-Object System.Drawing.Bitmap $src.Width, $src.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($conv)
    $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
    $g.Dispose()
    return $conv
}

function Convert-ToWhiteGlow {
    param(
        [System.Drawing.Bitmap]$src,
        [int]$LumMin = 22,
        [double]$Gamma = 0.52,
        [int]$MaxWhite = 255
    )
    $base = Convert-To32bpp $src
    $w = $base.Width
    $h = $base.Height
    $range = [Math]::Max(1.0, 255.0 - $LumMin)
    $out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $base.GetPixel($x, $y)
            $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
            if ($lum -lt $LumMin) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 0, 0, 0))
            }
            else {
                $t = ($lum - $LumMin) / $range
                $t = [Math]::Pow([Math]::Min(1.0, $t), $Gamma)
                $wi = [Math]::Min($MaxWhite, [int]($t * $MaxWhite))
                $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $wi, $wi, $wi))
            }
        }
    }
    $base.Dispose()
    return $out
}

function Get-CropRect {
    param(
        [int]$ImgW, [int]$ImgH,
        [double]$Top = 0, [double]$Bottom = 0,
        [double]$Left = 0, [double]$Right = 0
    )
    $x = [int]($ImgW * $Left)
    $y = [int]($ImgH * $Top)
    $w = [Math]::Max(1, [int]($ImgW * (1 - $Left - $Right)))
    $h = [Math]::Max(1, [int]($ImgH * (1 - $Top - $Bottom)))
    return @{ X = $x; Y = $y; Width = $w; Height = $h }
}

function Crop-Bitmap {
    param([System.Drawing.Bitmap]$src, [hashtable]$r)
    return $src.Clone(
        [System.Drawing.Rectangle]::new($r.X, $r.Y, $r.Width, $r.Height),
        $src.PixelFormat
    )
}

function Fit-ToCanvas {
    param(
        [System.Drawing.Bitmap]$src,
        [int]$canvasW,
        [int]$canvasH,
        [ValidateSet("Center", "Upper")]
        [string]$VAlign = "Center",
        [double]$Scale = 1.0,
        [int]$YOffset = 0
    )
    $out = New-Object System.Drawing.Bitmap $canvasW, $canvasH
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.Clear([System.Drawing.Color]::Black)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $scale = [Math]::Min($canvasW / $src.Width, $canvasH / $src.Height) * $Scale
    $nw = [Math]::Max(1, [int][Math]::Round($src.Width * $scale))
    $nh = [Math]::Max(1, [int][Math]::Round($src.Height * $scale))
    $x = [int](($canvasW - $nw) / 2)
    $y = if ($VAlign -eq "Upper") {
        [int]($canvasH * 0.06) - $YOffset
    }
    else {
        [int](($canvasH - $nh) / 2) - $YOffset
    }
    if ($y -lt 0) { $y = 0 }
    $g.DrawImage($src, $x, $y, $nw, $nh)
    $g.Dispose()
    return $out
}

function Export-SignCard {
    param(
        [System.Drawing.Bitmap]$src,
        [string]$OutputPath,
        [string]$VAlign = "Center",
        [int]$LumMin = 22,
        [double]$Gamma = 0.52,
        [double]$Scale = 1.0,
        [int]$MaxWhite = 255,
        [int]$YOffset = 0
    )
    $white = Convert-ToWhiteGlow $src -LumMin $LumMin -Gamma $Gamma -MaxWhite $MaxWhite
    $src.Dispose()
    $fitted = Fit-ToCanvas $white $OutW $OutH -VAlign $VAlign -Scale $Scale -YOffset $YOffset
    $white.Dispose()
    $fitted.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $fitted.Dispose()
    Write-Host "wrote $OutputPath (${OutW}x${OutH})"
}

function Process-Panel {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$PanelX, [int]$PanelW, [int]$ImgH,
        [hashtable]$InnerCrop,
        [string]$VAlign = "Upper",
        [int]$LumMin = 22,
        [double]$Gamma = 0.52,
        [double]$Scale = 1.0,
        [int]$MaxWhite = 255,
        [int]$YOffset = 0
    )
    $full = [System.Drawing.Bitmap]::FromFile($InputPath)
    $panel = Crop-Bitmap $full @{ X = $PanelX; Y = 0; Width = $PanelW; Height = $ImgH }
    $full.Dispose()
    $cropped = Crop-Bitmap $panel $InnerCrop
    $panel.Dispose()
    Export-SignCard $cropped $OutputPath -VAlign $VAlign -LumMin $LumMin -Gamma $Gamma -Scale $Scale -MaxWhite $MaxWhite -YOffset $YOffset
}

$silent = (Resolve-Path (Join-Path $PSScriptRoot "..\assets\images\silent")).Path

if ($processHello) { Write-Host "hello source: $($helloSrc.Name)" }
Write-Host "triple source: $($tripleSrc.Name)"

if ($processHello) {
    $helloBmp = [System.Drawing.Bitmap]::FromFile($helloSrc.FullName)
    $helloCrop = Get-CropRect $helloBmp.Width $helloBmp.Height -Top 0.16 -Bottom 0.35 -Left 0.04 -Right 0.04
    $helloPart = Crop-Bitmap $helloBmp $helloCrop
    $helloBmp.Dispose()
    Export-SignCard $helloPart (Join-Path $silent "sign-hello-particle.png") -YOffset 52
}

# 谢谢 / 再见：三栏图取中间、右栏（左栏手势与你好图重复风格）
$tripleBmp = [System.Drawing.Bitmap]::FromFile($tripleSrc.FullName)
$tw = $tripleBmp.Width
$th = $tripleBmp.Height
$col = [int]($tw / 3)
$col3 = $tw - ($col * 2)
$tripleBmp.Dispose()

# 谢谢 / 再见：少烟雾（提高亮度阈值）、整体缩小
$panel23 = @{
    LumMin = 48
    Gamma = 0.74
    Scale = 0.66
    MaxWhite = 182
}
$handCrop = Get-CropRect $col $th -Top 0.04 -Bottom 0.33 -Left 0.09 -Right 0.09
$handCrop3 = Get-CropRect $col3 $th -Top 0.04 -Bottom 0.33 -Left 0.09 -Right 0.09

Process-Panel $tripleSrc.FullName (Join-Path $silent "sign-thanks-particle.png") $col $col $th $handCrop @panel23
Process-Panel $tripleSrc.FullName (Join-Path $silent "sign-goodbye-particle.png") ($col * 2) $col3 $th $handCrop3 @panel23

Copy-Item $tripleSrc.FullName (Join-Path $silent "sign-triple-src.png") -Force
if ($processHello) {
    Copy-Item $helloSrc.FullName (Join-Path $silent "sign-hello-src.png") -Force
}
