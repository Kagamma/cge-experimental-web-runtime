unit TestFilesystem;

interface

uses
  SysUtils,
  WebWindow;

type
  TTestFilesystem = class(TWebWindow)
  public
    constructor Create;
  end;

implementation

constructor TTestFilesystem.Create;
var
  F: THandle;
  FF: File of Char;
  S: String;
  C: Char;
  DirectoryName: String = 'test';
  FileName: String = 'test/test.dat';
begin
  inherited;
  Writeln('TODO: Filesystem');

  Writeln('Looking for directory ', DirectoryName, '...');
  if DirectoryExists(DirectoryName) then
    Writeln('- Found!')
  else
    Writeln('- Not found!');

  Writeln('Create directory "', DirectoryName, '"');
  CreateDir(DirectoryName);

  Writeln('Looking for directory ', DirectoryName, '...');
  if DirectoryExists(DirectoryName) then
    Writeln('- Found!')
  else
    Writeln('- Not found!');

  Writeln('Looking for ', FileName, '...');
  if FileExists(FileName) then
    Writeln('- Found!')
  else
    Writeln('- Not found!');
  Writeln('Create a new ', FileName);
  F := FileCreate(FileName);

  Writeln('Looking for ', FileName, '...');
  if FileExists(FileName) then
    Writeln('- Found!')
  else
    Writeln('- Not found!');

  S := 'ABC123';
  Writeln('Write ', S ,' to ', FileName);
  FileWrite(F, S[1], Length(S));
  S := 'XYZ';
  Writeln('Write ', S ,' to ', FileName);
  FileWrite(F, S[1], Length(S));
  Writeln('Close file ', FileName);
  FileClose(F);

  Writeln('Open file ', FileName, ' with Assign() & Reset()');
  Assign(FF, FileName);
  Reset(FF);
  Writeln('Get ', FileName, ' size');
  Writeln('- ', FileSize(FF), ' bytes');
  Writeln('Read everthing from ', FileName);
  S := '';
  while not EOF(FF) do
  begin
    Read(FF, C);
    S := S + C;
  end;
  Writeln('- ', S);
  Writeln('Close file ', FileName);
  Close(FF);

  Writeln('Open file ', FileName);
  F := FileOpen(FileName, fmOpenRead);
  Writeln('Read 2 bytes from ', FileName);
  S := '   ';
  FileRead(F, S[1], 2);
  Writeln('- Result: ', S);

  Writeln('Seek to 3');
  FileSeek(F, 3, fsFromBeginning);
  Writeln('Read 3 bytes from ', FileName);
  S := '            ';
  FileRead(F, S[1], 3);
  Writeln('- Result: ', S);

  Writeln('Seek to 4');
  FileSeek(F, 4, fsFromBeginning);
  Writeln('Read 100 bytes from ', FileName);
  S := '            ';
  Writeln('- Actual bytes read: ', FileRead(F, S[1], 100), ' bytes');
  Writeln('- Result: ', S);

  Writeln('Close file ', FileName);
  FileClose(F);

  Writeln('Delete file ', FileName);
  DeleteFile(FileName);

  Writeln('Looking for ', FileName, '...');
  if FileExists(FileName) then
    Writeln('- Found!')
  else
    Writeln('- Not found!');

  Writeln('Delete directory ', DirectoryName);
  RemoveDir(DirectoryName);
end;

end.