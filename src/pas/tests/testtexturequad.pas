unit TestTextureQuad;

{$macro on}
{$define nl:=+ LineEnding +}

interface

uses
  Window, WebOpenGLES, WebImage, webfphttpclient;

type
  TTestTextureQuad = class(TWindow)
  private
    FTexture: GLuint;
    FVertexBuffer, FTexCoordBuffer: GLuint;
    FVertShader, FFragShader, FProg: GLuint;
    FVertexLoc, FTexCoordLoc: GLint;
    FAngleUniformLoc, FTextureUniformLoc: GLint;
    FAngle: Single;
    procedure Response(Status: Cardinal; Data: Pointer; Size: Cardinal);
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
'attribute vec2 texcoord;'nl
'uniform float angle;'nl
'varying lowp vec2 fragTexCoord;'nl
'void main(void) {'nl
'  vec3 v = vec3('nl
'    vertex.x * cos(angle) - vertex.y * sin(angle),'nl
'    vertex.x * sin(angle) + vertex.y * cos(angle), 0.0'nl
'  );'nl
'  gl_Position = vec4(v, 1.0);'nl
'  fragTexCoord = texcoord;'nl
'}';
  FragShaderSource: PChar =
'uniform sampler2D tex;'nl
'varying lowp vec2 fragTexCoord;'nl
'void main(void) {'nl
'  gl_FragColor = texture2D(tex, fragTexCoord);'nl
'}';
  Vertices: array[0..17] of Single = (
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
    -0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
    -0.5,  0.5, 0.0
  );
  TexCoords: array[0..11] of Single = (
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1
  );

procedure TTestTextureQuad.Response(Status: Cardinal; Data: Pointer; Size: Cardinal);
var
  Image: TWebImage;
begin
  if Status = 200 then
  begin
    Image := TWebImage.Create;
    Image.LoadFromMemory(Data, Size);
    glGenTextures(1, @FTexture);
    glBindTexture(GL_TEXTURE_2D, FTexture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, Image.Width, Image.Height, 0, GL_RGBA, GL_UNSIGNED_BYTE, Image.Data);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    Image.Free;
  end;
end;

constructor TTestTextureQuad.Create;
var
  Len: GLint;
begin
  inherited;
  TFPHTTPClient.SimpleGetAsync('/icon.png', '{}', @Self.Response);

  glGenBuffers(1, @FVertexBuffer);
  glBindBuffer(GL_ARRAY_BUFFER, FVertexBuffer);
  glBufferData(GL_ARRAY_BUFFER, SizeOf(Vertices), @Vertices[0], GL_STATIC_DRAW);
  glBindBuffer(GL_ARRAY_BUFFER, 0);

  glGenBuffers(1, @FTexCoordBuffer);
  glBindBuffer(GL_ARRAY_BUFFER, FTexCoordBuffer);
  glBufferData(GL_ARRAY_BUFFER, SizeOf(TexCoords), @TexCoords[0], GL_STATIC_DRAW);
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
  FTexCoordLoc := glGetAttribLocation(FProg, 'texcoord');
  FAngleUniformLoc := glGetUniformLocation(FProg, 'angle');
  FTextureUniformLoc := glGetUniformLocation(FProg, 'tex');
  FAngle := 0;
end;

destructor TTestTextureQuad.Destroy;
begin
  glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT);
  glDeleteProgram(FProg);
  glDeleteShader(FVertShader);
  glDeleteShader(FFragShader);
  glDeleteBuffers(1, @FVertexBuffer);
  glDeleteBuffers(1, @FTexCoordBuffer);
  if FTexture <> 0 then
    glDeleteTextures(1, @FTexture);
  inherited;
end;

procedure TTestTextureQuad.Update;
begin
  inherited;
end;

procedure TTestTextureQuad.Render(const DeltaTime: Single);
begin
  inherited;
  glViewport(0, 0, FViewportWidth, FViewportHeight);
  glClearColor(0, 0, 0, 1);
  glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT);

  glUseProgram(FProg);
  glUniform1f(FAngleUniformLoc, FAngle);

  glActiveTexture(GL_TEXTURE0);
  glBindTexture(GL_TEXTURE_2D, FTexture);

  glBindBuffer(GL_ARRAY_BUFFER, FVertexBuffer);
  glVertexAttribPointer(FVertexLoc, 3, GL_FLOAT, GL_FALSE, 0, nil);
  glEnableVertexAttribArray(FVertexLoc);

  glBindBuffer(GL_ARRAY_BUFFER, FTexCoordBuffer);
  glVertexAttribPointer(FTexCoordLoc, 2, GL_FLOAT, GL_FALSE, 0, nil);
  glEnableVertexAttribArray(FTexCoordLoc);

  glDrawArrays(GL_TRIANGLES, 0, 6);
  FAngle := FAngle + 1.68 * DeltaTime;
end;

end.
