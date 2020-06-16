var ts = require("typescript");
var babel = require("@babel/core");
var fs = require("fs");
var spawn = require("child_process").spawn;
var dirname = require("path").dirname;

function spawnString(source, dir) {
  return spawn("node", ["-e", source], {
    cwd: dir,
  });
}

// path has to be fully qualified
exports.spawnTypeScript = function spawnTypeScript(path) {
  var content = fs.readFileSync(path, "utf-8");

  var compilerOptions = {
    module: ts.ModuleKind.CommonJS,
  };

  var transpiled = ts.transpile(content, compilerOptions);

  return spawnString(transpiled, dirname(path));
};

exports.spawnJavaScript = function spawnJavaScript(path) {
  var content = fs.readFileSync(path, "utf-8");

  return spawnString(content, dirname(path));
};

exports.spawnBabel = function spawnBabel(path) {
  var content = fs.readFileSync(path, "utf-8");

  var result = babel.transform(content, {
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  });

  return spawnString(result.code, dirname(path));
};
