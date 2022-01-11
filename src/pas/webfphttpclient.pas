unit webfphttpclient;

interface

type
  TAsyncHttpResponse = procedure(Status: Cardinal; Data: Pointer; Size: Cardinal) of object;

  TFPHTTPClient = class
  public
    class procedure SimpleGet(Url, HeadersJson: String; Status: PCardinal; Data: PPointer; Size: PCardinal);
    class procedure SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncHttpResponse);
  end;

implementation

procedure Get(Url, HeadersJson: PChar; Status: PCardinal; Data: PPointer; Size: PCardinal); external 'fphttpclient' name 'get';
procedure GetAsync(Url, HeadersJson: PChar; Response: Uint64); external 'fphttpclient' name 'getAsync';

procedure ExecuteAsyncHttpResponse(const Response: Uint64; const Status: Cardinal; const Data: Pointer; const Size: Cardinal);
begin
  if Response <> 0 then
    TAsyncHttpResponse(Response)(Status, Data, Size);
end;

class procedure TFPHTTPClient.SimpleGet(Url: String; HeadersJson: String; Status: PCardinal; Data: PPointer; Size: PCardinal);
begin
  Get(PChar(Url), PChar(HeadersJson), Status, Data, SIze);
end;

class procedure TFPHTTPClient.SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncHttpResponse);
begin
  GetAsync(PChar(Url), PChar(HeadersJson), Uint64(Response));
end;

exports
  ExecuteAsyncHttpResponse;

end.