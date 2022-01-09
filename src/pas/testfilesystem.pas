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
  F: THandle;
  FF: File of Char;
  S: String = 'ABC123';
  C: Char;
begin
  inherited;
  Writeln('TODO: Filesystem');
  Writeln('Looking for "test.txt"...');
  if FileExists('test.txt') then
    Writeln('- Found!')
  else
    Writeln('- Not found!');
  Writeln('Create a new "test.txt"');
  F := FileCreate('test.txt');

  Writeln('Looking for "test.txt"...');
  if FileExists('test.txt') then
    Writeln('- Found!')
  else
    Writeln('- Not found!');

  Writeln('Write ', S ,' to "test.txt"');
  FileWrite(F, S[1], 6);
  Writeln('Close file "test.txt"');
  FileClose(F);

  Writeln('Get "test.txt" size');
  Assign(FF, 'test.txt');
  Reset(FF);
  Writeln('- ', FileSize(FF), ' bytes');
  Writeln('Read everthing from "test.txt"');
  S := '';
  while not EOF(FF) do
  begin
    Read(FF, C);
    S := S + C;
  end;
  Writeln('- ', S);
  Writeln('Close file "test.txt"');
  Close(FF);

  Writeln('Open file "test.txt"');
  F := FileOpen('test.txt', fmOpenRead);
  Writeln('Read 2 bytes from "test.txt"');
  S := '   ';
  FileRead(F, S[1], 2);
  Writeln('- Result: ', S);

  Writeln('Seek to 3');
  FileSeek(F, 3, fsFromBeginning);
  Writeln('Read 3 bytes from "test.txt"');
  S := '   ';
  FileRead(F, S[1], 3);
  Writeln('- Result: ', S);

  Writeln('Seek to 4');
  FileSeek(F, 4, fsFromBeginning);
  Writeln('Read 6 bytes from "test.txt"');
  S := '      ';
  Writeln('- Actual bytes read: ', FileRead(F, S[1], 6), ' bytes');
  Writeln('- Result: ', S);

  Writeln('Close file "test.txt"');
  FileClose(F);

  Writeln('Delete file "test.txt"');
  DeleteFile('test.txt');

  Writeln('Looking for "test.txt"...');
  if FileExists('test.txt') then
    Writeln('- Found!')
  else
    Writeln('- Not found!');
end;

end.