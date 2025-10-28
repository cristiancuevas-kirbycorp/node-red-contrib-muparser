#define MUPARSER_STATIC

#include <napi.h>
#include "muParser.h"
#include <map>
#include <string>
#include <cmath>

using namespace Napi;

class MuParserWrapper : public ObjectWrap<MuParserWrapper> {
public:
    static void Init(Napi::Env env, Napi::Object exports) {
        Napi::HandleScope scope(env);

        Napi::Function func = DefineClass(env, "MuParser", {
            InstanceMethod("setExpression", &MuParserWrapper::SetExpression),
            InstanceMethod("setVar", &MuParserWrapper::SetVar),
            InstanceMethod("eval", &MuParserWrapper::Eval)
        });

        exports.Set("MuParser", func);
    }

    MuParserWrapper(const Napi::CallbackInfo& info) 
        : ObjectWrap<MuParserWrapper>(info) {
        parser_.DefineOprt("**", [](double a, double b) { return std::pow(a, b); }, 15);
    }

private:
    mu::Parser parser_;
    std::map<std::string, double> vars_;

    void SetExpression(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expression must be a string").ThrowAsJavaScriptException();
            return;
        }

        std::string expr = info[0].As<Napi::String>().Utf8Value();
        try {
            parser_.SetExpr(expr);
        } catch (mu::Parser::exception_type& e) {
            Napi::Error::New(env, e.GetMsg()).ThrowAsJavaScriptException();
        }
    }

    void SetVar(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "setVar(name, value)").ThrowAsJavaScriptException();
            return;
        }

        std::string name = info[0].As<Napi::String>().Utf8Value();
        double value = info[1].As<Napi::Number>().DoubleValue();
        vars_[name] = value;
        parser_.DefineVar(name, &vars_[name]);
    }

    Napi::Value Eval(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        try {
            double result = parser_.Eval();
            return Napi::Number::New(env, result);
        } catch (mu::Parser::exception_type& e) {
            Napi::Error::New(env, e.GetMsg()).ThrowAsJavaScriptException();
            return env.Undefined();
        }
    }
};

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    MuParserWrapper::Init(env, exports);
    return exports;
}

NODE_API_MODULE(muparser_node, InitAll)