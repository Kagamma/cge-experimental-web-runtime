unit TestFPHTTPClient;

interface

uses
  SysUtils,
  WebWindow, webfphttpclient;

type
  TTestFPHTTPClient = class(TWebWindow)
  protected
    procedure Response(Status: Cardinal; Data: Pointer; Size: Cardinal);
  public
    constructor Create;
  end;

implementation

constructor TTestFPHTTPClient.Create;
begin
  inherited;
  Writeln('TODO: TFPHTTPClient');

  // Async
  Writeln('Async Get /index.html');
  TFPHTTPClient.SimpleGetAsync('/index.html', '{}', @Self.Response);
  Writeln('Async Get https://duckduckgo.com');
  TFPHTTPClient.SimpleGetAsync('https://duckduckgo.com', '{}', @Self.Response);
end;

procedure TTestFPHTTPClient.Response(Status: Cardinal; Data: Pointer; Size: Cardinal);
var
  I: Integer;
  S: String = '';
begin
  for I := 0 to Size - 1 do
    S := S + Char((Data + I)^);
  Writeln('Status from async get: ', Status);
  Writeln('Result from async get: ');
  Writeln('- ', S);
  FreeMem(Data);
end;

end.
