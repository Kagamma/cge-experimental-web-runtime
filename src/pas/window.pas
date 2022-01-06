unit Window;

interface

type
  TWindow = class
  public
    constructor Create;
    destructor Destroy; override;
    procedure Update; virtual;
    procedure Render(const DeltaTime: Single); virtual;
  end;

implementation

constructor TWindow.Create;
begin
  inherited;
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

end.