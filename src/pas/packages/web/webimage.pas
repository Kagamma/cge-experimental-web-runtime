unit webimage;

{$modeswitch advancedrecords}

interface

uses
  SysUtils, Classes;

type
  TWebColorRGBAValue = record
    case Kind: Byte of
      0:
        (
          Value: Cardinal;
        );
      1:
        (
          R, G, B, A: Byte;
        );
  end;

  TWebImage = class
  protected
    FData: Pointer;
    FWidth: Cardinal;
    FHeight: Cardinal;
    FBpp: Cardinal;
    function GetColor(const X, Y: Integer): TWebColorRGBAValue;
    procedure SetColor(const X, Y: integer; const Color: TWebColorRGBAValue);
  public
    constructor Create; overload;
    constructor Create(const AWidth, AHeight: Integer);
    destructor Destroy; override;
    { Decode a file from TStream }
    procedure LoadFromStream(const Stream: TStream);
    { Decode a file from memory. Data points to the file's in-memory data, size is file's size in bytes }
    procedure LoadFromMemory(const Data: Pointer; const Size: Cardinal);
    property Width: Cardinal read FWidth;
    property Height: Cardinal read FHeight;
    property Bpp: Cardinal read FBpp;
    property Data: Pointer read FData;
    property Colors[X, Y: Integer]: TWebColorRGBAValue read GetColor write SetColor;
  end;

implementation

function ImageLoad(Data: Pointer; Size: Cardinal; Width, Height, Bpp: PCardinal): Pointer; external 'image' name 'load';

function TWebImage.GetColor(const X, Y: Integer): TWebColorRGBAValue;
var
  P: PCardinal;
begin
  P := FData;
  Result.Value := (P + (X + Y * Width))^;
end;

procedure TWebImage.SetColor(const X, Y: Integer; const Color: TWebColorRGBAValue);
var
  P: PCardinal;
begin
  P := FData;
  (P + (X + Y * Width))^ := Color.Value;
end;

constructor TWebImage.Create;
begin
  inherited;
  FData := nil;
end;

constructor TWebImage.Create(const AWidth, AHeight: Integer);
begin
  inherited Create;
  if (AWidth <> 0) and (AHeight <> 0) then
    GetMem(FData, AWidth * AHeight * 4)
  else
    FData := nil;
end;

destructor TWebImage.Destroy;
begin
  if FData <> nil then
    FreeMem(FData);
  inherited;
end;

procedure TWebImage.LoadFromStream(const Stream: TStream);
var
  MS: TMemoryStream;
  IsMSOwned: Boolean = True;
begin
  if FData <> nil then
    FreeMem(FData);
  if Stream is TMemoryStream then
  begin
    MS := TMemoryStream(Stream);
    IsMSOwned := false;
  end else
    MS := TMemoryStream.Create;
  try
    if not IsMSOwned then
      MS.CopyFrom(Stream, Stream.Size);
    FData := ImageLoad(MS.Memory, MS.Size, @FWidth, @Height, @Bpp);
    if FData = nil then
      raise Exception.Create('Cannot decode image!');
  finally
    if IsMSOwned then
      FreeAndNil(MS);
  end;
end;

procedure TWebImage.LoadFromMemory(const Data: Pointer; const Size: Cardinal);
begin
  if FData <> nil then
    FreeMem(FData);
  FData := ImageLoad(Data, Size, @FWidth, @Height, @Bpp);
  if FData = nil then
    raise Exception.Create('Cannot decode image!');
end;

end.