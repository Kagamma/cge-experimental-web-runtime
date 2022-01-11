unit TestFPHTTPClient;

interface

uses
  SysUtils,
  Window, webfphttpclient;

type
  TTestFPHTTPClient = class(TWindow)
  protected
    procedure Response(Status: Cardinal; Data: Pointer; Size: Cardinal);
  public
    constructor Create;
  end;

implementation

constructor TTestFPHTTPClient.Create;
var
  Status, Size: Cardinal;
  Data: Pointer;
  I: Integer;
  S: String = '';
begin
  inherited;
  Writeln('TODO: TFPHTTPClient');

  // Sync
  Writeln('Get /index.html');
  TFPHTTPClient.SimpleGet('/index.html', '{}', @Status, @Data, @Size);
  Writeln('Status from get: ', Status);
  Writeln('Result from get: ');
  for I := 0 to Size - 1 do
    S := S + Char((Data + I)^);
  Writeln('- ', S);

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