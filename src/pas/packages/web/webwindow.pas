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
    procedure EventKeyDown(const KeyCode: Integer); virtual;
    procedure EventKeyUp(const KeyCode: Integer); virtual;
    procedure EventMouseMove(const X, Y: Integer); virtual;
    procedure EventMouseDown(const Button, X, Y: Integer); virtual;
    procedure EventMouseUp(const Button, X, Y: Integer); virtual;
    procedure EventMouseWheel(const Y: Integer); virtual;
  end;

procedure SetCaption(S: PChar); external 'window' name 'setCaption';

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

procedure TWebWindow.EventKeyDown(const KeyCode: Integer);
begin
end;

procedure TWebWindow.EventKeyUp(const KeyCode: Integer);
begin
end;

procedure TWebWindow.EventMouseMove(const X, Y: Integer);
begin
end;

procedure TWebWindow.EventMouseDown(const Button, X, Y: Integer);
begin
end;

procedure TWebWindow.EventMouseUp(const Button, X, Y: Integer);
begin
end;

procedure TWebWindow.EventMouseWheel(const Y: Integer);
begin
end;

procedure EventResize(Width, Height: Integer);
begin
  if Win <> nil then
    Win.EventResize(Width, Height);
end;

procedure EventKeyDown(KeyCode: Integer);
begin
  if Win <> nil then
    Win.EventKeyDown(KeyCode);
end;

procedure EventKeyUp(KeyCode: Integer);
begin
  if Win <> nil then
    Win.EventKeyUp(KeyCode);
end;

procedure EventMouseMove(X, Y: Integer);
begin
  if Win <> nil then
    Win.EventMouseMove(X, Y);
end;

procedure EventMouseDown(Button, X, Y: Integer);
begin
  if Win <> nil then
    Win.EventMouseDown(Button, X, Y);
end;

procedure EventMouseUp(Button, X, Y: Integer);
begin
  if Win <> nil then
    Win.EventMouseUp(Button, X, Y);
end;

procedure EventMouseWheel(Y: Integer);
begin
  if Win <> nil then
    Win.EventMouseWheel(Y);
end;

exports
  EventResize,
  EventKeyDown,
  EventKeyUp,
  EventMouseMove,
  EventMouseDown,
  EventMouseUp,
  EventMouseWheel;

end.