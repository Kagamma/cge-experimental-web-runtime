unit Window;

interface

type
  TWindow = class
  public
    constructor Create;
    destructor Destroy; override;
    procedure Run(const DeltaTime: Single); virtual;
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

procedure TWindow.Run(const DeltaTime: Single);
begin
  
end;

end.