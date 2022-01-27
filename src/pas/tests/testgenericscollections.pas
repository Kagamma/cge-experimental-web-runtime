unit TestGenericsCollections;

interface

uses
  SysUtils, Generics.Collections, Generics.Defaults,
  WebWindow;

type
  TTestGenericsCollections = class(TWebWindow)
  public
    constructor Create;
    procedure Test1;
    procedure Test2;
    procedure Test3;
    procedure Test4;
  end;

implementation

type
  TApple = class
    Name: string;
  end;

  TAppleList = specialize TObjectList<TApple>;

function CompareApples(constref Left, Right: TApple): Integer;
begin
  Result := AnsiCompareStr(Left.Name, Right.Name);
end;

type
  TAppleComparer = specialize TComparer<TApple>;
  TAppleDictionary = specialize TDictionary<string, TApple>;
  TAppleDictionary2 = specialize TObjectDictionary<string, TApple>;

constructor TTestGenericsCollections.Create;
begin
  inherited;
  Writeln('TODO: GenericsCollections');
  Test1;
  Test2;
  Test3;
  Test4;
end;

procedure TTestGenericsCollections.Test1;
var
  A: TApple;
  Apples: TAppleList;
begin
  Apples := TAppleList.Create(true);
  try
    A := TApple.Create;
    A.Name := 'my apple';
    Apples.Add(A);

    A := TApple.Create;
    A.Name := 'another apple';
    Apples.Add(A);

    Writeln('Count: ', Apples.Count);
    Writeln(Apples[0].Name);
    Writeln(Apples[1].Name);
  finally FreeAndNil(Apples) end;
end;

procedure TTestGenericsCollections.Test2;
var
  A: TApple;
  L: TAppleList;
begin
  L := TAppleList.Create(true);
  try
    A := TApple.Create;
    A.Name := '11';
    L.Add(A);

    A := TApple.Create;
    A.Name := '33';
    L.Add(A);

    A := TApple.Create;
    A.Name := '22';
    L.Add(A);

    L.Sort(TAppleComparer.Construct(@CompareApples));

    Writeln('Count: ', L.Count);
    Writeln(L[0].Name);
    Writeln(L[1].Name);
    Writeln(L[2].Name);
  finally FreeAndNil(L) end;
end;

procedure TTestGenericsCollections.Test3;
var
  Apples: TAppleDictionary;
  A, FoundA: TApple;
  ApplePair: TAppleDictionary.TDictionaryPair;
  AppleKey: string;
begin
  Apples := TAppleDictionary.Create;
  try
    A := TApple.Create;
    A.Name := 'my apple';
    Apples.AddOrSetValue('apple key 1', A);

    if Apples.TryGetValue('apple key 1', FoundA) then
      Writeln('Found apple under key "apple key 1" with name: ' +
        FoundA.Name);

    for AppleKey in Apples.Keys do
      Writeln('Found apple key: ' + AppleKey);
    for A in Apples.Values do
      Writeln('Found apple value: ' + A.Name);
    for ApplePair in Apples do
      Writeln('Found apple key->value: ' +
        ApplePair.Key + '->' + ApplePair.Value.Name);

    { Line below works too, but it can only be used to set
      an *existing* dictionary key.
      Instead of this, usually use AddOrSetValue
      to set or add a new key, as necessary. }
    // Apples['apple key 1'] := ... ;

    Apples.Remove('apple key 1');

    { Note that the TDictionary doesn't own the items,
      you need to free them yourself.
      We could use TObjectDictionary to have automatic ownership
      mechanism. }
    A.Free;
  finally FreeAndNil(Apples) end;
end;

procedure TTestGenericsCollections.Test4;
var
  Apples: TAppleDictionary2;
  A: TApple;
  ApplePair: TAppleDictionary2.TDictionaryPair;
begin
  Apples := TAppleDictionary2.Create([doOwnsValues]);
  try
    A := TApple.Create;
    A.Name := 'my apple';
    Apples.AddOrSetValue('apple key 1', A);

    for ApplePair in Apples do
      Writeln('Found apple key->value: ' +
        ApplePair.Key + '->' + ApplePair.Value.Name);

    Apples.Remove('apple key 1');
  finally FreeAndNil(Apples) end;
end;

end.