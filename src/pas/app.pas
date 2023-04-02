program App;

uses
  SysUtils,
  WebWindow, TestTriangle, TestFilesystem, TestTextureQuad, TestFPHTTPClient, TestGenericsCollections;

var
  Ticks: QWord;

procedure InitTestTriangle;
begin
  Ticks := GetTickCount64;
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTriangle.Create;
end;

procedure InitTestTextureQuad;
begin
  Ticks := GetTickCount64;
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTextureQuad.Create;
end;

procedure InitTestFilesystem;
begin
  Ticks := GetTickCount64;
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

procedure InitGenericsCollections;
begin
  Ticks := GetTickCount64;
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestGenericsCollections.Create;
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
  InitGenericsCollections,
  Run;

begin
  SetCaption('CGE experimental web runtime');
  Ticks := GetTickCount64;
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTriangle.Create;
end.
