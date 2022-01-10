unit fphttpclient;

interface

type
  TFPHTTPClient = class
  public
    class function SimpleGet(Url: String): String;
  end;

implementation

function Get(Url: PChar; Size: Pointer): Pointer; external 'fphttpclient' name 'get';

class function TFPHTTPClient.SimpleGet(Url: String): String;
var
  P: Pointer;
  Size: LongWord;
  I: Integer;
begin
  P := Get(PChar(Url), @Size);
  Result := '';
  for I := 0 to Size - 1 do
    Result := Result + Char((P + I)^);
  FreeMem(P);
end;

end.