unit fphttpclient;

interface

type
  TAsyncResponse = procedure(Data: Pointer; Size: Cardinal) of object;

  TFPHTTPClient = class
  public
    class function SimpleGet(Url: String): String;
    class procedure SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncResponse);
  end;

implementation

function Get(Url: PChar; Size: Pointer): Pointer; external 'fphttpclient' name 'get';
procedure GetAsync(Url, HeadersJson: PChar; Response: Uint64); external 'fphttpclient' name 'getAsync';

procedure ExecuteAsyncResponse(const Response: Uint64; const Data: Pointer; const Size: Cardinal);
begin
  if Response <> 0 then
    TAsyncResponse(Response)(Data, Size);
end;

class function TFPHTTPClient.SimpleGet(Url: String): String;
var
  P: Pointer;
  Size: Cardinal;
  I: Integer;
begin
  P := Get(PChar(Url), @Size);
  Result := '';
  for I := 0 to Size - 1 do
    Result := Result + Char((P + I)^);
  FreeMem(P);
end;

class procedure TFPHTTPClient.SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncResponse);
begin
  GetAsync(PChar(Url), PChar(HeadersJson), Uint64(Response));
end;

exports
  ExecuteAsyncResponse;

end.