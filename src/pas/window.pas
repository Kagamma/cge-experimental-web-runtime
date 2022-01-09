unit Window;

interface

type
  TWindow = class
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
  Win: TWindow = nil;

implementation

constructor TWindow.Create;
begin
  inherited;
  FViewportWidth := 640;
  FViewportHeight := 480;
end;

destructor TWindow.Destroy;
begin
  inherited;
end;

procedure TWindow.Update;
begin
  
end;

procedure TWindow.Render(const DeltaTime: Single);
begin
  
end;

procedure TWindow.EventResize(const Width, Height: Integer);
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