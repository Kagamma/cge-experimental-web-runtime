program App;

uses
  SysUtils,
  Window, TestTriangle, TestFilesystem, TestTextureQuad, TestFPHTTPClient;

var
  Ticks: QWord;

procedure InitTestTriangle;
begin
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTriangle.Create;
end;

procedure InitTestTextureQuad;
begin
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTextureQuad.Create;
end;

procedure InitTestFilesystem;
begin
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestFilesystem.Create;
end;

procedure InitFPHTTPClient;
begin
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestFPHTTPClient.Create;
end;

procedure Run;
var
  DeltaTime: Single;
begin
  DeltaTime := (GetTickCount64 - Ticks) / 1000;
  Ticks := GetTickCount64;

  Win.Update;
  Win.Render(DeltaTime);
end;

function AllocMem(Size: LongWord): Pointer;
begin
  GetMem(Result, Size);
end;

exports
  InitTestTriangle,
  InitTestTextureQuad,
  InitTestFilesystem,
  InitFPHTTPClient,
  AllocMem,
  Run;

begin
  Ticks := GetTickCount64;
end.
