unit WebWindow;

interface

type
  TWebWindow = class
  protected
    FViewportWidth, FViewportHeight: Integer;
  public
    constructor Create;
    destructor Destroy; override;
    procedure Update; virtual;
    procedure Render(const DeltaTime: Single); virtual;

    procedure EventResize(const Width, Height: Integer); virtual;
  end;

var
  Win: TWebWindow = nil;

implementation

constructor TWebWindow.Create;
begin
  inherited;
  FViewportWidth := 640;
  FViewportHeight := 480;
end;

destructor TWebWindow.Destroy;
begin
  inherited;
end;

procedure TWebWindow.Update;
begin
  
end;

procedure TWebWindow.Render(const DeltaTime: Single);
begin
  
end;

procedure TWebWindow.EventResize(const Width, Height: Integer);
begin
  FViewportWidth := Width;
  FViewportHeight := Height;
end;

procedure EventResize(Width, Height: Integer);
begin
  if Win <> nil then
    Win.EventResize(Width, Height);
end;

exports
  EventResize;

end.