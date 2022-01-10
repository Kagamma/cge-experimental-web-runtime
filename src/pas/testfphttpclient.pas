unit TestFPHTTPClient;

interface

uses
  SysUtils,
  Window, fphttpclient;

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
  TFPHTTPClient.SimpleGet('/test.wasm');
end;

end.