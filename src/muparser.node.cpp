#include <node.h>
#include <v8.h>
#include "muparser/include/muParser.h"
#include <map>

using namespace v8;

class MuParserWrapper : public node::ObjectWrap {
 public:
  static void Init(Local<Object> exports);
  mu::Parser parser;
  std::map<std::string, double> vars;

 private:
  explicit MuParserWrapper() {
    parser.DefineOprt("**", [](double a, double b){ return pow(a, b); }, 15);
  }
  ~MuParserWrapper() {}

  static void New(const FunctionCallbackInfo<Value>& args);
  static void SetExpression(const FunctionCallbackInfo<Value>& args);
  static void SetVar(const FunctionCallbackInfo<Value>& args);
  static void Eval(const FunctionCallbackInfo<Value>& args);

  static Persistent<Function> constructor;
};

Persistent<Function> MuParserWrapper::constructor;

void MuParserWrapper::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();

  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MuParser").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "setExpression", SetExpression);
  NODE_SET_PROTOTYPE_METHOD(tpl, "setVar", SetVar);
  NODE_SET_PROTOTYPE_METHOD(tpl, "eval", Eval);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());
  exports->Set(context, String::NewFromUtf8(isolate, "MuParser").ToLocalChecked(),
               tpl->GetFunction(context).ToLocalChecked()).Check();
}

void MuParserWrapper::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.IsConstructCall()) {
    MuParserWrapper* obj = new MuParserWrapper();
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    Local<Context> context = isolate->GetCurrentContext();
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    args.GetReturnValue().Set(cons->NewInstance(context).ToLocalChecked());
  }
}

void MuParserWrapper::SetExpression(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  MuParserWrapper* obj = ObjectWrap::Unwrap<MuParserWrapper>(args.Holder());
  String::Utf8Value expr(isolate, args[0]);
  try {
    obj->parser.SetExpr(*expr);
  } catch (mu::Parser::exception_type& e) {
    isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate, e.GetMsg().c_str()).ToLocalChecked()));
  }
}

void MuParserWrapper::SetVar(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  MuParserWrapper* obj = ObjectWrap::Unwrap<MuParserWrapper>(args.Holder());
  String::Utf8Value name(isolate, args[0]);
  double value = args[1]->IsNumber() ? args[1]->NumberValue(isolate->GetCurrentContext()).FromMaybe(0) : 0;
  obj->vars[*name] = value;
  obj->parser.DefineVar(*name, &obj->vars[*name]);
}

void MuParserWrapper::Eval(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  MuParserWrapper* obj = ObjectWrap::Unwrap<MuParserWrapper>(args.Holder());
  try {
    double result = obj->parser.Eval();
    args.GetReturnValue().Set(Number::New(isolate, result));
  } catch (mu::Parser::exception_type& e) {
    isolate->ThrowException(Exception::Error(String::NewFromUtf8(isolate, e.GetMsg().c_str()).ToLocalChecked()));
  }
}

NODE_MODULE(NODE_GYP_MODULE_NAME, MuParserWrapper::Init)