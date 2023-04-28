library App;

{$mode objfpc}{$H+}

uses
  CastleWindow, CastleLog, CastleUIState,
  GameStateMain;

var
  Window: TCastleWindow;

procedure ApplicationInitialize;
begin
  Window.Container.LoadSettings('castle-data:/CastleSettings.xml');
  StateMain := TStateMain.Create(Application);
  TUIState.Current := StateMain;
end;

procedure CGEApp;
begin
  Application.OnInitialize := @ApplicationInitialize;
  Window := TCastleWindow.Create(Application);
  Application.MainWindow := Window;
  Application.MainWindow.Open;
end;

exports
  CGEApp;

end.
