unit webimage;

interface

type
  TWebImage = class
  protected
    FData: Pointer;
    FWidth: Cardinal;
    FHeight: Cardinal;
    FBpp: Cardinal;
  public
    constructor Create;
    destructor Destroy; override;
    procedure LoadFromMemory(const Data: Pointer; const Size: Cardinal);
    property Width: Cardinal read FWidth;
    property Height: Cardinal read FHeight;
    property Bpp: Cardinal read FBpp;
    property Data: Pointer read FData;
  end;

implementation

function ImageLoad(Data: Pointer; Size: Cardinal; Width, Height: PCardinal): Pointer; external 'image' name 'load';

constructor TWebImage.Create;
begin
  inherited;
  FData := nil;
end;

destructor TWebImage.Destroy;
begin
  if FData <> nil then
    FreeMem(FData);
  inherited;
end;

procedure TWebImage.LoadFromMemory(const Data: Pointer; const Size: Cardinal);
begin
  if FData <> nil then
    FreeMem(FData);
  FData := ImageLoad(Data, Size, @FWidth, @Height);
  FBpp := 4;
end;

end.