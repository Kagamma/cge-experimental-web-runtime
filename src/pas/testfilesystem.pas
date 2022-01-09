unit TestFilesystem;

interface

uses
  SysUtils,
  Window;

type
  TTestFilesystem = class(TWindow)
  public
    constructor Create;
  end;

implementation

constructor TTestFilesystem.Create;
var
  F: TextFile;
begin
  inherited;
  Writeln('TODO: Filesystem');
  Writeln('Looking for "test.txt"...');
  if FileExists('test.txt') then
    Writeln('- Found!')
  else
    Writeln('- Not found!');
  Writeln('Create a new "test.txt"');
  AssignFile(F, 'test.txt');
end;

end.