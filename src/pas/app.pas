program App;

uses
  SysUtils,
  OpenGLES, Window, TestTriangle, TestFilesystem, TestTextureQuad, TestFPHTTPClient;

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

exports
  InitTestTriangle,
  InitTestTextureQuad,
  InitTestFilesystem,
  InitFPHTTPClient,
  Run;

begin
  Ticks := GetTickCount64;
end.
