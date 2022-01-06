unit TestFilesystem;

interface

uses
  Window;

type
  TTestFilesystem = class(TWindow)
  public
    constructor Create;
  end;

implementation

constructor TTestFilesystem.Create;
begin
  inherited;
  Writeln('TODO: Filesystem');
end;

end.