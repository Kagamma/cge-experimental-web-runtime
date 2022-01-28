unit WebVariant;

{$modeswitch nestedprocvars}
{$modeswitch advancedrecords}

interface

type
  TWebVariantKind = (
    wvBoolean,
    wvNumber,
    wvString,
    wvArray,
    wvPointer
  );
  TWebVariant = record
    VarString: String;
    case Kind: TWebVariantKind of
      wvBoolean:
        (
          VarBoolean: Boolean;
          VarBooleanPad: Cardinal;
        );
      wvNumber:
        (
          VarNumber: Double;
        );
      wvString:
        (
          VarStringDummy: Int64;
        );
      wvArray:
        (
          VarArray: Pointer;
          VarArrayPad: Cardinal;
        );
      wvPointer:
        (
          VarPointer: Pointer;
          VarPointerPad: Cardinal;
        );
  end;
  TWebVariantArray = array of TWebVariant;
  PWebVariant = ^TWebVariant;

operator := (V: Double) R: TWebVariant;
operator := (V: String) R: TWebVariant;
operator := (V: Boolean) R: TWebVariant;
operator := (V: TWebVariantArray) R: TWebVariant;
operator := (V: Pointer) R: TWebVariant;
operator := (V: TWebVariant) R: Integer;
operator := (V: TWebVariant) R: Int64;
operator := (V: TWebVariant) R: QWord;
operator := (V: TWebVariant) R: Boolean;
operator := (V: TWebVariant) R: Double;
operator := (V: TWebVariant) R: String;
operator := (V: TWebVariant) R: TWebVariantArray;
operator := (V: TWebVariant) R: Pointer;
operator + (V1: TWebVariant; V2: Double) R: TWebVariant;
operator + (V1: TWebVariant; V2: String) R: TWebVariant;
operator + (V1: TWebVariant; V2: Pointer) R: TWebVariant;
operator - (V1: TWebVariant; V2: Double) R: TWebVariant;
operator - (V1: TWebVariant; V2: Pointer) R: TWebVariant;
operator * (V1: TWebVariant; V2: Double) R: TWebVariant;
operator / (V1: TWebVariant; V2: Double) R: TWebVariant;
operator + (V1, V2: TWebVariant) R: TWebVariant;
operator - (V1, V2: TWebVariant) R: TWebVariant;
operator - (V: TWebVariant) R: TWebVariant;
operator * (V1, V2: TWebVariant) R: TWebVariant;
operator / (V1, V2: TWebVariant) R: TWebVariant;
operator < (V1: TWebVariant; V2: Double) R: Boolean;
operator > (V1: TWebVariant; V2: Double) R: Boolean;
operator <= (V1: TWebVariant; V2: Double) R: Boolean;
operator >= (V1: TWebVariant; V2: Double) R: Boolean;
operator = (V1: TWebVariant; V2: Double) R: Boolean;
operator <> (V1: TWebVariant; V2: String) R: Boolean;
operator < (V1, V2: TWebVariant) R: Boolean;
operator > (V1, V2: TWebVariant) R: Boolean;
operator <= (V1, V2: TWebVariant) R: Boolean;
operator >= (V1, V2: TWebVariant) R: Boolean;
operator = (V1, V2: TWebVariant) R: Boolean;
operator <> (V1, V2: TWebVariant) R: Boolean;

implementation

operator := (V: Double) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := V;
end;
operator := (V: String) R: TWebVariant;
begin
  R.Kind := wvString;
  R.VarString := V;
end;
operator := (V: Boolean) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := Integer(V);
end;
operator := (V: TWebVariantArray) R: TWebVariant;
begin
  R.Kind := wvArray;
  R.VarArray := Pointer(V);
end;
operator := (V: Pointer) R: TWebVariant;
begin
  R.Kind := wvPointer;
  R.VarPointer := V;
end;

operator := (V: TWebVariant) R: Integer;
begin
  R := Round(V.VarNumber);
end;
operator := (V: TWebVariant) R: Int64;
begin
  R := Round(V.VarNumber);
end;
operator := (V: TWebVariant) R: QWord;
begin
  R := Round(V.VarNumber);
end;
operator := (V: TWebVariant) R: Boolean;
begin
  R := Round(V.VarNumber) <> 0;
end;
operator := (V: TWebVariant) R: Double;
begin
  R := V.VarNumber;
end;
operator := (V: TWebVariant) R: String;
begin
  R := V.VarString;
end;
operator := (V: TWebVariant) R: TWebVariantArray;
begin
  R := TWebVariantArray(V.VarArray);
end;
operator := (V: TWebVariant) R: Pointer;
begin
  R := V.VarPointer;
end;

operator + (V1: TWebVariant; V2: Double) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := V1.VarNumber + V2;
end;
operator + (V1: TWebVariant; V2: String) R: TWebVariant;
begin
  R.VarString := V2;
end;
operator + (V1: TWebVariant; V2: Pointer) R: TWebVariant;
begin
  R.Kind := wvPointer;
  R.VarPointer := V1.VarPointer + V2;
end;

operator - (V1: TWebVariant; V2: Double) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := V1.VarNumber - V2;
end;
operator - (V1: TWebVariant; V2: Pointer) R: TWebVariant;
begin
  R.Kind := wvString;
  R.VarPointer := V1.VarPointer + V2;
end;

operator * (V1: TWebVariant; V2: Double) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := V1.VarNumber * V2;
end;

operator / (V1: TWebVariant; V2: Double) R: TWebVariant;
begin
  R.Kind := wvNumber;
  R.VarNumber := V1.VarNumber / V2;
end;

operator + (V1, V2: TWebVariant) R: TWebVariant;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      begin
        R.Kind := wvNumber;
        R.VarNumber := V1.VarNumber + V2.VarNumber;
      end;
    wvPointer:
      begin
        R.Kind := wvPointer;
        R.VarPointer := V1.VarPointer + V2.VarPointer;
      end;
    wvString:
      begin
        R.Kind := wvString;
        R.VarString := V1.VarString + V2.VarString;
      end;
  end;
end;
operator - (V: TWebVariant) R: TWebVariant;
begin
  case V.Kind of
    wvNumber:
      R.VarNumber := -V.VarNumber;
  end;
end;
operator - (V1, V2: TWebVariant) R: TWebVariant;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      begin
        R.Kind := wvNumber;
        R.VarNumber := V1.VarNumber - V2.VarNumber;
      end;
    wvPointer:
      begin
        R.Kind := wvPointer;
        R.VarPointer := Pointer(V1.VarPointer - V2.VarPointer);
      end;
  end;
end;
operator * (V1, V2: TWebVariant) R: TWebVariant;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      begin
        R.Kind := wvNumber;
        R.VarNumber := V1.VarNumber * V2.VarNumber;
      end;
  end;
end;
operator / (V1, V2: TWebVariant) R: TWebVariant;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      begin
        R.Kind := wvNumber;
        R.VarNumber := V1.VarNumber * V2.VarNumber;
      end;
  end;
end;

operator < (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber < V2;
  end;
end;
operator > (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber > V2;
  end;
end;
operator <= (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber <= V2;
  end;
end;
operator >= (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber >= V2;
  end;
end;
operator = (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber = V2;
  end;
end;
operator = (V1: TWebVariant; V2: String) R: Boolean;
begin
  case V1.Kind of
    wvString:
      R := V1.VarString = V2;
  end;
end;
operator <> (V1: TWebVariant; V2: Double) R: Boolean;
begin
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber <> V2;
  end;
end;
operator <> (V1: TWebVariant; V2: String) R: Boolean;
begin
  case V1.Kind of
    wvString:
      R := V1.VarString <> V2;
  end;
end;

operator < (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber < V2.VarNumber;
  end;
end;
operator > (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber > V2.VarNumber;
  end;
end;
operator <= (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber <= V2.VarNumber;
  end;
end;
operator >= (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber >= V2.VarNumber;
  end;
end;
operator = (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber = V2.VarNumber;
  end;
end;
operator <> (V1, V2: TWebVariant) R: Boolean;
begin
  if V1.Kind = V2.Kind then
  case V1.Kind of
    wvNumber:
      R := V1.VarNumber <> V2.VarNumber;
    wvString:
      R := V1.VarString <> V2.VarString;
  end;
end;

end.