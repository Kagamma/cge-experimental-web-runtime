unit TestFPHTTPClient;

interface

uses
  SysUtils,
  Window, webfphttpclient;

type
  TTestFPHTTPClient = class(TWindow)
  protected
    procedure Response(Data: Pointer; Size: Cardinal);
  public
    constructor Create;
  end;

implementation

constructor TTestFPHTTPClient.Create;
begin
  inherited;
  Writeln('TODO: TFPHTTPClient');
  Writeln('Get /index.html');
  Writeln('Result from get: ');
  Writeln('- ', TFPHTTPClient.SimpleGet('/index.html'));
  Writeln('Async Get /index.html');
  TFPHTTPClient.SimpleGetAsync('/index.html', '{}', @Self.Response);
end;

procedure TTestFPHTTPClient.Response(Data: Pointer; Size: Cardinal);
var
  I: Integer;
  S: String = '';
begin
  for I := 0 to Size - 1 do
    S := S + Char((Data + I)^);
  Writeln('Result from async get: ');
  Writeln('- ', S);
end;

end.