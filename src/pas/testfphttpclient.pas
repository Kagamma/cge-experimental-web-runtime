unit TestFPHTTPClient;

interface

uses
  SysUtils,
  Window;

type
  TTestFPHTTPClient = class(TWindow)
  public
    constructor Create;
  end;

implementation

constructor TTestFPHTTPClient.Create;
begin
  inherited;
  Writeln('TODO: TFPHTTPClient');
end;

end.