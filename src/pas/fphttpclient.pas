unit fphttpclient;

interface

type
  TFPHTTPClient = class
  public
    class procedure SimpleGet(Url: PChar);
  end;

implementation

function Get(Url: PChar; Size: Pointer): Pointer; external 'fphttpclient' name 'get';

class procedure TFPHTTPClient.SimpleGet(Url: PChar);
var
  P: Pointer;
  Size: LongWord;
begin
  P := Get(Url, @Size);
  FreeMem(P);
end;

end.