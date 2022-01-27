unit TestTriangle;

{$macro on}
{$define nl:=+ LineEnding +}

interface

uses
  WebWindow, WebOpenGLES;

type
  TTestTriangle = class(TWebWindow)
  private
    FVertexBuffer: GLuint;
    FVertShader, FFragShader, FProg: GLuint;
    FVertexLoc: GLint;
    FAngleUniformLoc: GLint;
    FAngle: Single;
  public
    constructor Create;
    destructor Destroy; override;
    procedure Update; override;
    procedure Render(const DeltaTime: Single); override;
  end;

implementation

var
  VertShaderSource: PChar =
'attribute vec3 vertex;'nl
'uniform float angle;'nl
'void main(void) {'nl
'  vec3 v = vec3('nl
'    vertex.x * cos(angle) - vertex.y * sin(angle),'nl
'    vertex.x * sin(angle) + vertex.y * cos(angle), 0.0'nl
'  );'nl
'  gl_Position = vec4(v, 1.0);'nl
'}';
  FragShaderSource: PChar =
'void main(void) {'nl
'  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);'nl
'}';
  Vertices: array[0..8] of Single = (
    0.0,  0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
  );

constructor TTestTriangle.Create;
var
  Len: GLint;
begin
  inherited;
  glGenBuffers(1, @FVertexBuffer);
  glBindBuffer(GL_ARRAY_BUFFER, FVertexBuffer);
  glBufferData(GL_ARRAY_BUFFER, SizeOf(Vertices), @Vertices[0], GL_STATIC_DRAW);
  glBindBuffer(GL_ARRAY_BUFFER, 0);

  FVertShader := glCreateShader(GL_VERTEX_SHADER);
  Len := Length(VertShaderSource);
  glShaderSource(FVertShader, 1, @VertShaderSource, @Len);
  glCompileShader(FVertShader);

  FFragShader := glCreateShader(GL_FRAGMENT_SHADER);
  Len := Length(FragShaderSource);
  glShaderSource(FFragShader, 1, @FragShaderSource, @Len);
  glCompileShader(FFragShader);

  FProg := glCreateProgram;
  glAttachShader(FProg, FVertShader);
  glAttachShader(FProg, FFragShader);
  glLinkProgram(FProg);

  FVertexLoc := glGetAttribLocation(FProg, 'vertex');
  FAngleUniformLoc := glGetUniformLocation(FProg, 'angle');
  FAngle := 0;
end;

destructor TTestTriangle.Destroy;
begin
  glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT);
  glDeleteProgram(FProg);
  glDeleteShader(FVertShader);
  glDeleteShader(FFragShader);
  glDeleteBuffers(1, @FVertexBuffer);
  inherited;
end;

procedure TTestTriangle.Update;
begin
  inherited;
end;

procedure TTestTriangle.Render(const DeltaTime: Single);
begin
  inherited;
  glViewport(0, 0, FViewportWidth, FViewportHeight);
  glClearColor(0, 0, 0, 1);
  glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT);

  glUseProgram(FProg);
  glUniform1f(FAngleUniformLoc, FAngle);
  glBindBuffer(GL_ARRAY_BUFFER, FVertexBuffer);
  glVertexAttribPointer(FVertexLoc, 3, GL_FLOAT, GL_FALSE, 0, nil);
  glEnableVertexAttribArray(FVertexLoc);
  glDrawArrays(GL_TRIANGLES, 0, 3);
  FAngle := FAngle + 1.68 * DeltaTime;
end;

end.
