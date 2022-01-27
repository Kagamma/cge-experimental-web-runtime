unit webimage;

interface

uses
  SysUtils, Classes;

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
    { Decode a file from TStream }
    procedure LoadFromStream(const Stream: TStream);
    { Decode a file from memory. Data points to the file's in-memory data, size is file's size in bytes }
    procedure LoadFromMemory(const Data: Pointer; const Size: Cardinal);
    property Width: Cardinal read FWidth;
    property Height: Cardinal read FHeight;
    property Bpp: Cardinal read FBpp;
    property Data: Pointer read FData;
  end;

implementation

function ImageLoad(Data: Pointer; Size: Cardinal; Width, Height, Bpp: PCardinal): Pointer; external 'image' name 'load';

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

procedure TWebImage.LoadFromStream(const Stream: TStream);
var
  MS: TMemoryStream;
begin
  MS := TMemoryStream.Create;
  try
    MS.CopyFrom(Stream, Stream.Size);
    FData := ImageLoad(MS.Memory, MS.Size, @FWidth, @Height, @Bpp);
  finally
    FreeAndNil(MS);
  end;
end;

procedure TWebImage.LoadFromMemory(const Data: Pointer; const Size: Cardinal);
begin
  if FData <> nil then
    FreeMem(FData);
  FData := ImageLoad(Data, Size, @FWidth, @Height, @Bpp);
end;

end.