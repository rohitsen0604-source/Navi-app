Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null

$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync('C:\Users\Hp\Downloads\3.pdf')) ([Windows.Storage.StorageFile])
$pdfDoc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
$page = $pdfDoc.GetPage(0)

$folder = Await ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync('C:\Users\Hp\.gemini\antigravity-ide\scratch\Navi-app\customer_app\assets\images')) ([Windows.Storage.StorageFolder])
$outStorageFile = Await ($folder.CreateFileAsync('naavi_logo.png', [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
$stream = Await ($outStorageFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)) ([Windows.Storage.Streams.IRandomAccessStream])

$renderOptions = New-Object Windows.Data.Pdf.PdfPageRenderOptions
$renderOptions.DestinationWidth = 1000

$asTaskVoid = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' })[0]
$netTaskVoid = $asTaskVoid.Invoke($null, @($page.RenderToStreamAsync($stream, $renderOptions)))
$netTaskVoid.Wait(-1) | Out-Null

$stream.Dispose()
$page.Dispose()
Write-Output 'RENDER_SUCCESS'
