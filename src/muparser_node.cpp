#define MUPARSER_STATIC
#include <napi.h>
#include "muParser.h"
#include <map>
#include <string>

class MuParserWrapper : public Napi::ObjectWrap<MuParserWrapper> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "MuParser", {
            InstanceMethod("setExpression", &MuParserWrapper::SetExpression),
            InstanceMethod("setVar", &MuParserWrapper::SetVar),
            InstanceMethod("eval", &MuParserWrapper::Eval)
        });

        Napi::FunctionReference* constructor = new Napi::FunctionReference();
        *constructor = Napi::Persistent(func);
        env.SetInstanceData(constructor);

        exports.Set("MuParser", func);
        return exports;
    }

    MuParserWrapper(const Napi::CallbackInfo& info) 
        : Napi::ObjectWrap<MuParserWrapper>(info), parser_(nullptr) {
        // Use heap allocation
        parser_ = new mu::Parser();
    }

    ~MuParserWrapper() {
        if (parser_) {
            delete parser_;
            parser_ = nullptr;
        }
    }

private:
    mu::Parser* parser_;
    std::map<std::string, double> vars_;

    void SetExpression(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (!parser_) {
            Napi::Error::New(env, "Parser not initialized").ThrowAsJavaScriptException();
            return;
        }
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expression must be a string").ThrowAsJavaScriptException();
            return;
        }

        std::string expr = info[0].As<Napi::String>().Utf8Value();
        try {
            parser_->SetExpr(expr);
        } catch (mu::Parser::exception_type& e) {
            Napi::Error::New(env, e.GetMsg()).ThrowAsJavaScriptException();
        }
    }

    void SetVar(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (!parser_) {
            Napi::Error::New(env, "Parser not initialized").ThrowAsJavaScriptException();
            return;
        }
        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "setVar(name, value)").ThrowAsJavaScriptException();
            return;
        }

        std::string name = info[0].As<Napi::String>().Utf8Value();
        double value = info[1].As<Napi::Number>().DoubleValue();
        vars_[name] = value;
        parser_->DefineVar(name, &vars_[name]);
    }

    Napi::Value Eval(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (!parser_) {
            Napi::Error::New(env, "Parser not initialized").ThrowAsJavaScriptException();
            return env.Undefined();
        }
        try {
            double result = parser_->Eval();
            return Napi::Number::New(env, result);
        } catch (mu::Parser::exception_type& e) {
            Napi::Error::New(env, e.GetMsg()).ThrowAsJavaScriptException();
            return env.Undefined();
        }
    }
};

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return MuParserWrapper::Init(env, exports);
}

NODE_API_MODULE(muparser_node, InitAll)