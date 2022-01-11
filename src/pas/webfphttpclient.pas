unit webfphttpclient;

interface

type
  TAsyncHttpResponse = procedure(Status: Cardinal; Data: Pointer; Size: Cardinal) of object;

  TFPHTTPClient = class
  public
    class procedure SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncHttpResponse);
  end;

implementation

procedure GetAsync(Url, HeadersJson: PChar; Response: Uint64); external 'fphttpclient' name 'getAsync';

procedure ExecuteAsyncHttpResponse(const Response: Uint64; const Status: Cardinal; const Data: Pointer; const Size: Cardinal);
begin
  if Response <> 0 then
    TAsyncHttpResponse(Response)(Status, Data, Size);
end;

class procedure TFPHTTPClient.SimpleGetAsync(Url, HeadersJson: String; Response: TAsyncHttpResponse);
begin
  GetAsync(PChar(Url), PChar(HeadersJson), Uint64(Response));
end;

exports
  ExecuteAsyncHttpResponse;

end.