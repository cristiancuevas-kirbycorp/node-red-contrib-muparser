{
  "targets": [
    {
      "target_name": "muparser_node",
      "sources": [
        "src/muparser_node.cpp",
        "muparser/src/muParser.cpp",
        "muparser/src/muParserBase.cpp",
        "muparser/src/muParserBytecode.cpp",
        "muparser/src/muParserCallback.cpp",
        "muparser/src/muParserDLL.cpp",
        "muparser/src/muParserError.cpp",
        "muparser/src/muParserInt.cpp",
        "muparser/src/muParserTest.cpp",
        "muparser/src/muParserTokenReader.cpp"
      ],
      "include_dirs": [
        "muparser/include",
        "node_modules/node-addon-api"
      ],
      "defines": [
        "MUPARSER_STATIC"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "conditions": [
        [ "OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": { "ExceptionHandling": 1 }
          }
        }]
      ]
    }
  ]
}