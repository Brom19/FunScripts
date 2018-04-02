Start-Sleep -s 1

$folder = "$env:USERPROFILE\Downloads\Torrent_OK"
$seriefolder = "$env:USERPROFILE\Videos\Series"
$moviefolder = "$env:USERPROFILE\Videos\Films"
$exclude = "Torrent_en-cours"

cd $folder

Get-ChildItem -Path $folder -Recurse -Include *.mkv,*.mp4,*.avi | ForEach {
    
    $filename = $_.Name
    $filename = $filename.Trim()
    $filename = $filename -replace "^\[.*\]",""
    $filename = $filename.Trim()

    if ( $filename -match "S\d{2}E\d{2}" ) {
        $seriename = $filename -replace "S\d{2}E\d{2}.*",""
        $seriename = $seriename.Trim(".")
        $seriename = $seriename -replace "\.", " "
        $seriename = $seriename.Trim()

        New-Item -Path $seriefolder -Name $seriename -ItemType directory -ErrorAction SilentlyContinue
        
        $newname = "$seriefolder\$seriename\$filename"
    } else {
        $newname = "$moviefolder\$filename"
    }
    #Write-Host $_.FullName
    #Write-Host $newname
    if ( $_.FullName -notmatch $exclude ) {
        Move-Item -LiteralPath ($_.FullName) $newname -ErrorAction Continue
    }
}

#Write-Host "Supprime les fichiers inutiles"
Get-ChildItem $folder -Recurse -Include *.html,*.jpg ,*.nfo | Remove-Item -ErrorAction SilentlyContinue

#Write-Host "Supprime les dossiers vide dans Serie"
Get-ChildItem $seriefolder -Recurse -Directory | where { @(gci $_.Fullname).count -eq 0} | Remove-Item -ErrorAction SilentlyContinue

#Write-Host "Supprime les dossiers vide dans Torrent"
Get-ChildItem $folder -Recurse -Directory | where { @(gci $_.Fullname).count -eq 0 -and $_.FullName -notmatch $exclude } | Remove-Item -ErrorAction SilentlyContinue

#Le script de synchro vers l'USB est sur le disque cible, s'il n'est pas branché : pas de synchro
Invoke-Expression -Command:"H:\CopyTo_USB.cmd"
