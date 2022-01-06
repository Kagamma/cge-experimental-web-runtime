program App;

uses
  SysUtils,
  OpenGLES, Window, TestTriangle;

var
  Win: TWindow = nil;
  Ticks: QWord;

procedure InitTestTriangle;
begin
  if Win <> nil then
    FreeAndNil(Win);
  Win := TTestTriangle.Create;
end;

procedure Run;
var
  DeltaTime: Single;
begin
  DeltaTime := (GetTickCount64 - Ticks) / 1000;
  Win.Run(DeltaTime);
  Ticks := GetTickCount64;
end;

exports
  InitTestTriangle,
  Run;

begin
  Ticks := GetTickCount64;
end.
